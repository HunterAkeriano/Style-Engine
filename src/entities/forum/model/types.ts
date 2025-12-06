import type { ForumAttachment } from '@/shared/api/forum'

export type ForumAttachmentDraft = ForumAttachment & {
  file?: File
  preview?: string
}
