import { Router } from 'express'
import { z } from 'zod'
import { col, fn, literal, Op, where } from 'sequelize'
import { getModels } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, type AuthRequest } from '../middleware/auth'
import { normalizePayload, stableStringify } from '../utils/payloadNormalization'
import type { SavedAnimation, SavedClipPath, SavedGradient, SavedShadow, User } from '../models'

const saveSchema = z.object({
  name: z.string().min(1).max(120),
  payload: z.record(z.any())
})

export type Category = 'gradient' | 'shadow' | 'animation' | 'clip-path'

type SavedModelClass = typeof SavedGradient | typeof SavedShadow | typeof SavedAnimation | typeof SavedClipPath

export function createSavesRouter(env: Env) {
  const router = Router()
  const auth = createAuthMiddleware(env)
  const { SavedGradient, SavedShadow, SavedAnimation, SavedClipPath, User } = getModels()
  const modelMap: Record<Category, SavedModelClass> = {
    gradient: SavedGradient,
    shadow: SavedShadow,
    animation: SavedAnimation,
    'clip-path': SavedClipPath
  }

  function modelForCategory(category: Category) {
    return modelMap[category]
  }

  function toPlainSaved(item: SavedGradient | SavedShadow | SavedAnimation | SavedClipPath) {
    const plain = item.get({ plain: true }) as any
    delete plain.user
    return plain
  }

  async function enforceLimit(_category: Category, req: AuthRequest) {
    const [gradients, shadows, animations, clipPaths] = await Promise.all([
      SavedGradient.count({ where: { userId: req.userId } }),
      SavedShadow.count({ where: { userId: req.userId } }),
      SavedAnimation.count({ where: { userId: req.userId } }),
      SavedClipPath.count({ where: { userId: req.userId } })
    ])
    const total = gradients + shadows + animations + clipPaths
    const tier = req.authUser?.subscriptionTier || (req.authUser?.isPayment ? 'pro' : 'free')
    const limit = tier === 'premium' ? Infinity : tier === 'pro' ? 50 : 5
    if (total >= limit) {
      return { message: 'Storage limit reached', limit }
    }
    return null
  }

  async function list(category: Category, req: AuthRequest, res: any) {
    const model = modelForCategory(category)
    const items = await model.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']]
    })
    res.json({ items: items.map(toPlainSaved) })
  }

  async function listPublic(category: Category, _req: any, res: any) {
    const model = modelForCategory(category)

    const whereConditions: any = { status: 'approved' }
    if (category !== 'clip-path') {
      whereConditions[Op.and] = [
        {
          [Op.or]: [
            { '$user.email$': null },
            where(fn('LOWER', col('user.email')), { [Op.ne]: env.SUPER_ADMIN_EMAIL.toLowerCase() })
          ]
        }
      ]
    }

    const items = await model.findAll({
      where: whereConditions,
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'avatarUrl'], required: false }],
      order: [
        ['isFeatured', 'DESC'],
        [literal('"approved_at"'), 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: 50
    })

    const mapped = items.map((item) => {
      const plain = item.get({ plain: true }) as any
      const owner = plain.user as User | undefined
      delete plain.user
      return {
        ...plain,
        ownerName: owner?.name ?? null,
        ownerEmail: owner?.email ?? null,
        ownerAvatar: owner?.avatarUrl ?? null
      }
    })

    res.json({ items: mapped })
  }

  async function create(category: Category, req: AuthRequest, res: any) {
    const parsed = saveSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })
    const limitError = await enforceLimit(category, req)
    if (limitError) return res.status(403).json(limitError)
    const model = modelForCategory(category)
    const { name, payload } = parsed.data
    const duplicateCheck = await model.findOne({ where: { userId: req.userId, payload } })
    if (duplicateCheck) {
      return res.status(409).json({ message: 'Already saved' })
    }
    const created = await model.create({
      userId: req.userId,
      name,
      payload,
      status: 'private'
    })
    res.status(201).json({ item: toPlainSaved(created) })
  }

  async function remove(category: Category, req: AuthRequest, res: any) {
    const model = modelForCategory(category)
    const id = req.params.id
    await model.destroy({ where: { id, userId: req.userId } })
    res.status(204).send()
  }

  async function requestPublish(category: Category, req: AuthRequest, res: any) {
    const model = modelForCategory(category)
    const id = req.params.id

    // Get the item to publish
    const item = await model.findOne({ where: { id, userId: req.userId, status: 'private' } })

    if (!item) {
      return res.status(404).json({ message: 'Item not found or already published' })
    }

    const normalizedPayload = normalizePayload(category, item.payload as any)
    const payloadHash = stableStringify(normalizedPayload)

    // Check for duplicates in approved or pending items
    const allPublicItems = await model.findAll({
      where: { status: { [Op.in]: ['approved', 'pending'] } },
      attributes: ['payload']
    })

    for (const publicItem of allPublicItems) {
      const publicNormalized = normalizePayload(category, publicItem.payload as any)
      const publicHash = stableStringify(publicNormalized)

      if (payloadHash === publicHash) {
        return res.status(409).json({ message: 'This item already exists in public collection' })
      }
    }

    // Update status to pending
    await item.update({ status: 'pending' })
    res.json({ item: toPlainSaved(item) })
  }

  /**
   * @swagger
   * /api/saves/gradients:
   *   get:
   *     summary: Получить список сохраненных градиентов
   *     description: Возвращает все сохраненные градиенты текущего пользователя
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список градиентов успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/gradients', auth, (req, res) => list('gradient', req, res))
  /**
   * @swagger
   * /api/saves/public/gradients:
   *   get:
   *     summary: Получить опубликованные градиенты
   *     description: Возвращает до 50 одобренных градиентов (включая избранные)
   *     tags: [Saves]
   *     responses:
   *       200:
   *         description: Список опубликованных градиентов
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   */
  router.get('/public/gradients', (req, res) => listPublic('gradient', req, res))

  /**
   * @swagger
   * /api/saves/gradients:
   *   post:
   *     summary: Сохранить градиент
   *     description: Создает новую запись с настройками градиента
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - payload
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Название градиента
   *                 example: Sunset Gradient
   *               payload:
   *                 type: object
   *                 description: Настройки градиента в JSON формате
   *                 example: { "type": "linear", "angle": 45, "colors": [{"color": "#ff0000", "position": 0}] }
   *     responses:
   *       201:
   *         description: Градиент успешно сохранен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/gradients', auth, (req, res) => create('gradient', req, res))
  /**
   * @swagger
   * /api/saves/gradients/{id}/publish:
   *   post:
   *     summary: Отправить градиент на модерацию
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: ID сохраненного градиента
   *     responses:
   *       200:
   *         description: Градиент отправлен на модерацию
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Элемент не найден
   */
  router.post('/gradients/:id/publish', auth, (req, res) => requestPublish('gradient', req, res))

  /**
   * @swagger
   * /api/saves/gradients/{id}:
   *   delete:
   *     summary: Удалить сохраненный градиент
   *     description: Удаляет градиент по ID
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID градиента
   *     responses:
   *       204:
   *         description: Градиент успешно удален
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/gradients/:id', auth, (req, res) => remove('gradient', req, res))

  /**
   * @swagger
   * /api/saves/shadows:
   *   get:
   *     summary: Получить список сохраненных теней
   *     description: Возвращает все сохраненные тени текущего пользователя
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список теней успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/shadows', auth, (req, res) => list('shadow', req, res))
  /**
   * @swagger
   * /api/saves/public/shadows:
   *   get:
   *     summary: Получить опубликованные тени
   *     tags: [Saves]
   *     responses:
   *       200:
   *         description: Список опубликованных теней
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   */
  router.get('/public/shadows', (req, res) => listPublic('shadow', req, res))

  /**
   * @swagger
   * /api/saves/shadows:
   *   post:
   *     summary: Сохранить тень
   *     description: Создает новую запись с настройками тени
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - payload
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Название тени
   *                 example: Soft Shadow
   *               payload:
   *                 type: object
   *                 description: Настройки тени в JSON формате
   *                 example: { "layers": [{"x": 0, "y": 4, "blur": 8, "spread": 0, "color": "#00000033"}] }
   *     responses:
   *       201:
   *         description: Тень успешно сохранена
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/shadows', auth, (req, res) => create('shadow', req, res))
  /**
   * @swagger
   * /api/saves/shadows/{id}/publish:
   *   post:
   *     summary: Отправить тень на модерацию
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: ID сохраненной тени
   *     responses:
   *       200:
   *         description: Тень отправлена на модерацию
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Элемент не найден
   */
  router.post('/shadows/:id/publish', auth, (req, res) => requestPublish('shadow', req, res))

  /**
   * @swagger
   * /api/saves/shadows/{id}:
   *   delete:
   *     summary: Удалить сохраненную тень
   *     description: Удаляет тень по ID
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID тени
   *     responses:
   *       204:
   *         description: Тень успешно удалена
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/shadows/:id', auth, (req, res) => remove('shadow', req, res))

  /**
   * @swagger
   * /api/saves/animations:
   *   get:
   *     summary: Получить список сохраненных анимаций
   *     description: Возвращает все сохраненные анимации текущего пользователя
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список анимаций успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/animations', auth, (req, res) => list('animation', req, res))
  /**
   * @swagger
   * /api/saves/public/animations:
   *   get:
   *     summary: Получить опубликованные анимации
   *     tags: [Saves]
   *     responses:
   *       200:
   *         description: Список опубликованных анимаций
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   */
  router.get('/public/animations', (req, res) => listPublic('animation', req, res))

  /**
   * @swagger
   * /api/saves/animations:
   *   post:
   *     summary: Сохранить анимацию
   *     description: Создает новую запись с настройками анимации
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - payload
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Название анимации
   *                 example: Bounce Effect
   *               payload:
   *                 type: object
   *                 description: Настройки анимации в JSON формате
   *                 example: { "name": "bounce", "duration": "1s", "timingFunction": "ease-in-out", "iterationCount": "infinite" }
   *     responses:
   *       201:
   *         description: Анимация успешно сохранена
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/animations', auth, (req, res) => create('animation', req, res))
  /**
   * @swagger
   * /api/saves/animations/{id}/publish:
   *   post:
   *     summary: Отправить анимацию на модерацию
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: ID сохраненной анимации
   *     responses:
   *       200:
   *         description: Анимация отправлена на модерацию
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Элемент не найден
   */
  router.post('/animations/:id/publish', auth, (req, res) => requestPublish('animation', req, res))

  /**
   * @swagger
   * /api/saves/animations/{id}:
   *   delete:
   *     summary: Удалить сохраненную анимацию
   *     description: Удаляет анимацию по ID
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID анимации
   *     responses:
   *       204:
   *         description: Анимация успешно удалена
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/animations/:id', auth, (req, res) => remove('animation', req, res))

  /**
   * @swagger
   * /api/saves/clip-paths:
   *   get:
   *     summary: Получить список сохраненных clip-path
   *     description: Возвращает все сохраненные clip-path текущего пользователя
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список clip-path успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/clip-paths', auth, (req, res) => list('clip-path', req, res))
  /**
   * @swagger
   * /api/saves/public/clip-paths:
   *   get:
   *     summary: Получить опубликованные clip-path
   *     tags: [Saves]
   *     responses:
   *       200:
   *         description: Список опубликованных clip-path
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   */
  router.get('/public/clip-paths', (req, res) => listPublic('clip-path', req, res))

  /**
   * @swagger
   * /api/saves/clip-paths:
   *   post:
   *     summary: Сохранить clip-path
   *     description: Создает новую запись с настройками clip-path
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - payload
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Название clip-path
   *                 example: Star Shape
   *               payload:
   *                 type: object
   *                 description: Настройки clip-path в JSON формате
   *                 example: { "layers": [{"type": "polygon", "points": [{"x": 50, "y": 0}]}] }
   *     responses:
   *       201:
   *         description: Clip-path успешно сохранен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/clip-paths', auth, (req, res) => create('clip-path', req, res))
  /**
   * @swagger
   * /api/saves/clip-paths/{id}/publish:
   *   post:
   *     summary: Отправить clip-path на модерацию
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: ID сохраненного clip-path
   *     responses:
   *       200:
   *         description: Clip-path отправлен на модерацию
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Элемент не найден
   */
  router.post('/clip-paths/:id/publish', auth, (req, res) => requestPublish('clip-path', req, res))

  /**
   * @swagger
   * /api/saves/clip-paths/{id}:
   *   delete:
   *     summary: Удалить сохраненный clip-path
   *     description: Удаляет clip-path по ID
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID clip-path
   *     responses:
   *       204:
   *         description: Clip-path успешно удален
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/clip-paths/:id', auth, (req, res) => remove('clip-path', req, res))

  return router
}
