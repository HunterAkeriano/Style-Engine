import { Router } from 'express'
import { getModels } from '../config/db'
import { sendApiError } from '../utils/apiError'
import type { Env } from '../config/env'
import { createAuthMiddleware, requireAdmin, type AuthRequest } from '../middleware/auth'
import type { Category } from './saves'
import type { SavedAnimation, SavedClipPath, SavedGradient, SavedShadow } from '../models'


export function createModerationRouter(env: Env) {
  const router = Router()
  const auth = createAuthMiddleware(env)
  const { SavedGradient, SavedShadow, SavedAnimation, SavedClipPath } = getModels()
  type SavedModel = typeof SavedGradient | typeof SavedShadow | typeof SavedAnimation | typeof SavedClipPath
  const modelMap: Record<Category, SavedModel> = {
    gradient: SavedGradient,
    shadow: SavedShadow,
    animation: SavedAnimation,
    'clip-path': SavedClipPath
  }

  const toItem = (item: SavedGradient | SavedShadow | SavedAnimation | SavedClipPath, category: Category) => ({
    ...item.get({ plain: true }),
    category
  })

  /**
   * @swagger
   * /api/moderation/pending:
   *   get:
   *     summary: Очередь модерации
   *     description: Возвращает все работы в статусе pending для всех категорий
   *     tags: [Moderation]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Очередь модерации загружена
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       403:
   *         description: Нет прав администратора
   */
  router.get('/pending', auth, requireAdmin, async (_req, res) => {
    const [gradients, shadows, animations, clipPaths] = await Promise.all([
      SavedGradient.findAll({ where: { status: 'pending' } }),
      SavedShadow.findAll({ where: { status: 'pending' } }),
      SavedAnimation.findAll({ where: { status: 'pending' } }),
      SavedClipPath.findAll({ where: { status: 'pending' } })
    ])

    const items = [
      ...gradients.map((item) => toItem(item, 'gradient')),
      ...shadows.map((item) => toItem(item, 'shadow')),
      ...animations.map((item) => toItem(item, 'animation')),
      ...clipPaths.map((item) => toItem(item, 'clip-path'))
    ].sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )

    res.json({ items })
  })

  /**
   * @swagger
   * /api/moderation/approved:
   *   get:
   *     summary: Список одобренных элементов
   *     description: Возвращает все работы в статусе approved для всех категорий
   *     tags: [Moderation]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список одобренных элементов загружен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       403:
   *         description: Нет прав администратора
   */
  router.get('/approved', auth, requireAdmin, async (_req, res) => {
    const [gradients, shadows, animations, clipPaths] = await Promise.all([
      SavedGradient.findAll({ where: { status: 'approved' } }),
      SavedShadow.findAll({ where: { status: 'approved' } }),
      SavedAnimation.findAll({ where: { status: 'approved' } }),
      SavedClipPath.findAll({ where: { status: 'approved' } })
    ])

    const items = [
      ...gradients.map((item) => toItem(item, 'gradient')),
      ...shadows.map((item) => toItem(item, 'shadow')),
      ...animations.map((item) => toItem(item, 'animation')),
      ...clipPaths.map((item) => toItem(item, 'clip-path'))
    ].sort(
      (a, b) => new Date(b.approvedAt ?? 0).getTime() - new Date(a.approvedAt ?? 0).getTime()
    )

    res.json({ items })
  })

  /**
   * @swagger
   * /api/moderation/{category}/{id}/approve:
   *   post:
   *     summary: Утвердить работу
   *     description: Переводит элемент в статус approved и помечает как избранный
   *     tags: [Moderation]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *           enum: [gradient, shadow, animation]
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Работа утверждена
   *       400:
   *         description: Неверная категория
   *       403:
   *         description: Нет прав администратора
   *       404:
   *         description: Элемент не найден
   */
  router.post('/:category/:id/approve', auth, requireAdmin, async (req: AuthRequest, res) => {
    const category = req.params.category as Category
    const model = modelMap[category]
    if (!model) {
      return sendApiError(res, 400, 'Invalid category')
    }
    const item = await model.findByPk(req.params.id)
    if (!item) {
      return sendApiError(res, 404, 'Item not found')
    }
    await item.update({ status: 'approved', isFeatured: true, approvedAt: new Date() })
    res.json({ item: toItem(item, category) })
  })

  /**
   * @swagger
   * /api/moderation/{category}/{id}:
   *   put:
   *     summary: Редактировать элемент
   *     description: Обновляет имя одобренного элемента
   *     tags: [Moderation]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *           enum: [gradient, shadow, animation, clip-path]
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Элемент обновлен
   *       400:
   *         description: Неверная категория
   *       403:
   *         description: Нет прав администратора
   *       404:
   *         description: Элемент не найден
  */
  router.put('/:category/:id', auth, requireAdmin, async (req: AuthRequest, res) => {
    const category = req.params.category as Category
    const model = modelMap[category]
    if (!model) {
      return sendApiError(res, 400, 'Invalid category')
    }
    const { name } = req.body
    if (!name || typeof name !== 'string') {
      return sendApiError(res, 400, 'Name is required')
    }
    const item = await model.findOne({ where: { id: req.params.id, status: 'approved' } })
    if (!item) {
      return sendApiError(res, 404, 'Item not found or not approved')
    }
    await item.update({ name })
    res.json({ item: toItem(item, category) })
  })

  /**
   * @swagger
   * /api/moderation/{category}/{id}:
   *   delete:
   *     summary: Удалить элемент
   *     description: Удаляет одобренный элемент
   *     tags: [Moderation]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *           enum: [gradient, shadow, animation, clip-path]
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Элемент удален
   *       400:
   *         description: Неверная категория
   *       403:
   *         description: Нет прав администратора
   *       404:
   *         description: Элемент не найден
   */
  router.delete('/:category/:id', auth, requireAdmin, async (req: AuthRequest, res) => {
    const category = req.params.category as Category
    const model = modelMap[category]
    if (!model) {
      return sendApiError(res, 400, 'Invalid category')
    }
    const deleted = await model.destroy({ where: { id: req.params.id, status: 'approved' } })
    if (!deleted) {
      return sendApiError(res, 404, 'Item not found or not approved')
    }
    res.json({ success: true })
  })

  return router
}
