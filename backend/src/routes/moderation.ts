import { Router } from 'express'
import { getDb } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, requireAdmin, type AuthRequest } from '../middleware/auth'
import type { Category } from './saves'

function tableForCategory(category: Category) {
  switch (category) {
    case 'gradient':
      return 'saved_gradients'
    case 'shadow':
      return 'saved_shadows'
    case 'animation':
      return 'saved_animations'
    case 'clip-path':
      return 'saved_clip_paths'
  }
}

export function createModerationRouter(env: Env) {
  const router = Router()
  const auth = createAuthMiddleware(env)
  const db = getDb()

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
    const result = await db.query(
      `SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", 'gradient' as category, created_at as "createdAt"
       FROM saved_gradients WHERE status = 'pending'
       UNION ALL
       SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", 'shadow' as category, created_at as "createdAt"
       FROM saved_shadows WHERE status = 'pending'
       UNION ALL
       SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", 'animation' as category, created_at as "createdAt"
       FROM saved_animations WHERE status = 'pending'
       UNION ALL
       SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", 'clip-path' as category, created_at as "createdAt"
       FROM saved_clip_paths WHERE status = 'pending'
       ORDER BY "createdAt" DESC`
    )

    res.json({ items: result.rows })
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
    const result = await db.query(
      `SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", 'gradient' as category, created_at as "createdAt"
       FROM saved_gradients WHERE status = 'approved'
       UNION ALL
       SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", 'shadow' as category, created_at as "createdAt"
       FROM saved_shadows WHERE status = 'approved'
       UNION ALL
       SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", 'animation' as category, created_at as "createdAt"
       FROM saved_animations WHERE status = 'approved'
       UNION ALL
       SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", 'clip-path' as category, created_at as "createdAt"
       FROM saved_clip_paths WHERE status = 'approved'
       ORDER BY "approvedAt" DESC`
    )

    res.json({ items: result.rows })
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
    if (!['gradient', 'shadow', 'animation', 'clip-path'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }
    const table = tableForCategory(category)
    const result = await db.query(
      `UPDATE ${table}
       SET status = 'approved', is_featured = TRUE, approved_at = NOW()
       WHERE id = $1
       RETURNING id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", created_at as "createdAt"`,
      [req.params.id]
    )
    if (!result.rowCount) {
      return res.status(404).json({ message: 'Item not found' })
    }
    res.json({ item: { ...result.rows[0], category } })
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
    if (!['gradient', 'shadow', 'animation', 'clip-path'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }
    const { name } = req.body
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Name is required' })
    }
    const table = tableForCategory(category)
    const result = await db.query(
      `UPDATE ${table}
       SET name = $1
       WHERE id = $2 AND status = 'approved'
       RETURNING id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", created_at as "createdAt"`,
      [name, req.params.id]
    )
    if (!result.rowCount) {
      return res.status(404).json({ message: 'Item not found or not approved' })
    }
    res.json({ item: { ...result.rows[0], category } })
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
    if (!['gradient', 'shadow', 'animation', 'clip-path'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }
    const table = tableForCategory(category)
    const result = await db.query(
      `DELETE FROM ${table}
       WHERE id = $1 AND status = 'approved'
       RETURNING id`,
      [req.params.id]
    )
    if (!result.rowCount) {
      return res.status(404).json({ message: 'Item not found or not approved' })
    }
    res.json({ success: true })
  })

  return router
}
