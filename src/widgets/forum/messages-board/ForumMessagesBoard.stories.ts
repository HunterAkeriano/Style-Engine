import { h, getCurrentInstance } from 'vue'
import { createI18n } from 'vue-i18n'
import type { Meta, StoryObj } from '@storybook/vue3'
import ForumMessagesBoard, { type MessageNode } from './ForumMessagesBoard.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      FORUM: {
        TOPIC: {
          THREAD_TITLE: 'Discussion',
          REPLY: 'Reply',
          EDIT: 'Edit',
          SAVE_EDIT: 'Save edit',
          CANCEL_REPLY: 'Cancel',
          REPLY_TITLE: 'Reply to thread',
          REPLY_HINT: 'Keep it concise and helpful.',
          REPLY_PLACEHOLDER: 'Write your reply...',
          SEND: 'Send',
          SENDING: 'Sending...',
          ADD_IMAGE: 'Add image',
          ADD_VIDEO: 'Add video',
          REMOVE: 'Remove',
          IMAGE: 'Image',
          VIDEO: 'Video',
          REPLYING_TO: 'Replying to {name}',
          EDITED: 'Edited'
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
    return h('div', { style: 'max-width: 980px; margin: 24px auto;' }, [h('Story')])
  }
})

const now = new Date().toISOString()
const messageTree: MessageNode[] = [
  {
    id: '1',
    topicId: 't1',
    userId: 'u1',
    parentId: null,
    content: 'How do I stop my gradient banding on Safari?',
    attachments: [{ type: 'image', url: 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=600&q=60' }],
    editedAt: null,
    editedBy: null,
    createdAt: now,
    updatedAt: now,
    author: { id: 'u1', name: 'Jess', email: 'jess@example.com', avatarUrl: null, subscriptionTier: 'premium' },
    replies: [
      {
        id: '1-1',
        topicId: 't1',
        userId: 'u2',
        parentId: '1',
        content: 'Add a tiny noise layer or dither—also try reducing contrast between stops.',
        attachments: [],
        editedAt: null,
        editedBy: null,
        createdAt: now,
        updatedAt: now,
        author: { id: 'u2', name: 'Mark', email: 'mark@example.com', avatarUrl: null, subscriptionTier: 'pro' },
        replies: [
          {
            id: '1-1-1',
            topicId: 't1',
            userId: 'u3',
            parentId: '1-1',
            content: 'Can confirm, 1–2% noise PNG overlay fixes this.',
            attachments: [],
            editedAt: null,
            editedBy: null,
            createdAt: now,
            updatedAt: now,
            author: { id: 'u3', name: 'Mira', email: 'mira@example.com', avatarUrl: null, subscriptionTier: 'free' },
            replies: []
          }
        ]
      }
    ]
  }
]

const meta: Meta<typeof ForumMessagesBoard> = {
  title: 'Widgets/Forum/MessagesBoard',
  component: ForumMessagesBoard,
  decorators: [withI18n],
  args: {
    title: 'Discussion',
    loading: false,
    loadingText: 'Loading...',
    emptyText: 'No messages yet.',
    canReply: true,
    topicStatus: 'open',
    currentUserId: 'u1',
    isAdmin: false,
    replyTargetId: null,
    replyFormConfig: {
      title: 'Reply',
      hint: 'Keep it on-topic.',
      placeholder: 'Write your reply...',
      sendLabel: 'Send',
      cancelLabel: 'Cancel',
      allowVideo: true,
      sending: false
    },
    formatDate: (value: string) => new Date(value).toLocaleString()
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    messages: messageTree
  }
}

export const Loading: Story = {
  args: {
    loading: true,
    messages: []
  }
}

export const Empty: Story = {
  args: {
    loading: false,
    messages: []
  }
}
