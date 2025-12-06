import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.resolve(process.cwd(), 'uploads/avatars')
    ensureDir(dest)
    cb(null, dest)
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    cb(null, `avatar-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'))
  }
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

const forumStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const topicId = (req.query.topicId as string) || 'temp'
    const dest = path.resolve(process.cwd(), 'uploads/forum', topicId)
    ensureDir(dest)
    cb(null, dest)
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    cb(null, `forum-${uniqueSuffix}${ext}`)
  }
})

export const uploadForumAttachment = multer({
  storage: forumStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})
