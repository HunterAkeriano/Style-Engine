import { h, getCurrentInstance } from 'vue'
import { createI18n } from 'vue-i18n'
import type { Meta, StoryObj } from '@storybook/vue3'
import ForumReplyForm from './ForumReplyForm.vue'
import type { ForumMessage } from '@/shared/api/forum'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      FORUM: {
        TOPIC: {
          REPLY_TITLE: 'Reply to thread',
          REPLY_HINT: 'Share more details to help resolve the issue.',
          TOTAL: 'Messages: {count}',
          ADD_IMAGE: 'Add image',
          YOUTUBE_PLACEHOLDER: 'YouTube link (admins only)',
          ADD_VIDEO: 'Add video',
          SENDING: 'Sending...',
          SEND: 'Send reply',
          IMAGE: 'Image',
          VIDEO: 'Video',
          REMOVE: 'Remove',
          CANCEL_REPLY: 'Cancel reply'
        }
      }
    }
  }
})

const withI18n = (story: any) => ({
  components: { Story: story },
  setup() {
    const app = getCurrentInstance()?.appContext.app
    if (app && !(app as any)._i18n) {
      app.use(i18n)
    }
    return {}
  },
  render() {
    return h('div', { style: 'max-width: 960px; margin: 24px auto;' }, [h('Story')])
  }
})

const baseMessage: ForumMessage = {
  id: 'm1',
  topicId: 't1',
  userId: 'u2',
  parentId: null,
  content: 'Original message content about a CSS bug.',
  attachments: [],
  editedAt: null,
  editedBy: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: {
    id: 'u2',
    name: 'Alice',
    email: 'alice@example.com',
    avatarUrl: null,
    role: 'user',
    subscriptionTier: 'pro'
  }
}

const meta: Meta<typeof ForumReplyForm> = {
  title: 'Features/Forum/ReplyForm',
  component: ForumReplyForm,
  decorators: [withI18n],
  args: {
    canReply: true,
    sendLabel: 'Send reply',
    title: 'Reply to thread',
    hint: 'Stay on topic and add useful details.',
    totalLabel: 'Messages: 12',
    placeholder: 'Write your reply...',
    allowVideo: true
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    replyingTo: null,
    sending: false
  }
}

export const Replying: Story = {
  args: {
    replyingTo: baseMessage,
    cancelReplyLabel: 'Cancel',
    sending: false
  }
}
