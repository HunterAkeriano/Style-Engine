import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import Modal from './Modal.vue'

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    closable: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    showActions: { control: 'boolean' },
    showConfirm: { control: 'boolean' },
    showCancel: { control: 'boolean' },
    confirmVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline']
    },
    confirmDisabled: { control: 'boolean' },
    buttonSize: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    onConfirm: { action: 'confirmed' },
    onClose: { action: 'closed' },
    'onUpdate:visible': { action: 'visibility-changed' }
  },
  args: {
    visible: false,
    size: 'md',
    closable: true,
    closeOnBackdrop: true,
    showActions: false,
    showConfirm: true,
    showCancel: true,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'primary',
    confirmDisabled: false,
    buttonSize: 'md'
  }
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: args => ({
    components: { Modal },
    setup() {
      const isVisible = ref(false)
      const openModal = () => {
        isVisible.value = true
      }
      return { args, isVisible, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Open Modal
        </button>
        <Modal v-model:visible="isVisible" v-bind="args" title="Basic Modal">
          <p>This is a basic modal with custom content.</p>
          <p>You can close it by clicking the X button, pressing ESC, or clicking outside.</p>
        </Modal>
      </div>
    `
  })
}

export const WithActions: Story = {
  render: args => ({
    components: { Modal },
    setup() {
      const isVisible = ref(false)
      const openModal = () => {
        isVisible.value = true
      }
      const handleConfirm = () => {
        alert('Confirmed!')
        isVisible.value = false
      }
      return { args, isVisible, openModal, handleConfirm }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Open Modal with Actions
        </button>
        <Modal
          v-model:visible="isVisible"
          v-bind="args"
          title="Confirm Action"
          subtitle="Please confirm your action"
          @confirm="handleConfirm"
        >
          <p>Are you sure you want to proceed with this action?</p>
          <p>This action cannot be undone.</p>
        </Modal>
      </div>
    `
  }),
  args: {
    showActions: true,
    confirmText: 'Yes, proceed',
    cancelText: 'Cancel'
  }
}

export const SmallSize: Story = {
  render: args => ({
    components: { Modal },
    setup() {
      const isVisible = ref(false)
      const openModal = () => {
        isVisible.value = true
      }
      return { args, isVisible, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Open Small Modal
        </button>
        <Modal v-model:visible="isVisible" v-bind="args" title="Small Modal">
          <p>This is a small modal window.</p>
        </Modal>
      </div>
    `
  }),
  args: {
    size: 'sm'
  }
}

export const LargeSize: Story = {
  render: args => ({
    components: { Modal },
    setup() {
      const isVisible = ref(false)
      const openModal = () => {
        isVisible.value = true
      }
      return { args, isVisible, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Open Large Modal
        </button>
        <Modal v-model:visible="isVisible" v-bind="args" title="Large Modal" subtitle="This modal has more space">
          <p>This is a large modal window with more content space.</p>
          <p>It's useful for forms, detailed information, or complex interactions.</p>
          <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <h4 style="margin-top: 0;">Additional Content</h4>
            <p>You can add any content here, including forms, images, or other components.</p>
          </div>
        </Modal>
      </div>
    `
  }),
  args: {
    size: 'lg'
  }
}

export const NotClosable: Story = {
  render: args => ({
    components: { Modal },
    setup() {
      const isVisible = ref(false)
      const openModal = () => {
        isVisible.value = true
      }
      const handleConfirm = () => {
        isVisible.value = false
      }
      return { args, isVisible, openModal, handleConfirm }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Open Non-Closable Modal
        </button>
        <Modal
          v-model:visible="isVisible"
          v-bind="args"
          title="Important Notice"
          @confirm="handleConfirm"
        >
          <p>This modal can only be closed by clicking the confirm button.</p>
          <p>The X button and backdrop click are disabled.</p>
        </Modal>
      </div>
    `
  }),
  args: {
    closable: false,
    closeOnBackdrop: false,
    showActions: true,
    showCancel: false,
    confirmText: 'I understand'
  }
}

export const DangerAction: Story = {
  render: args => ({
    components: { Modal },
    setup() {
      const isVisible = ref(false)
      const openModal = () => {
        isVisible.value = true
      }
      const handleConfirm = () => {
        alert('Deleted!')
        isVisible.value = false
      }
      return { args, isVisible, openModal, handleConfirm }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Delete Item
        </button>
        <Modal
          v-model:visible="isVisible"
          v-bind="args"
          title="Delete Confirmation"
          subtitle="This action is permanent"
          @confirm="handleConfirm"
        >
          <p style="color: #dc3545; font-weight: 500;">Warning: This action cannot be undone!</p>
          <p>Are you sure you want to delete this item? All associated data will be permanently removed.</p>
        </Modal>
      </div>
    `
  }),
  args: {
    showActions: true,
    confirmText: 'Delete',
    cancelText: 'Cancel'
  }
}

export const WithCustomFooter: Story = {
  render: args => ({
    components: { Modal },
    setup() {
      const isVisible = ref(false)
      const openModal = () => {
        isVisible.value = true
      }
      return { args, isVisible, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Open Modal with Custom Footer
        </button>
        <Modal v-model:visible="isVisible" v-bind="args" title="Custom Footer">
          <p>This modal has a custom footer with multiple buttons.</p>
          <template #footer>
            <div style="display: flex; gap: 8px; justify-content: space-between; width: 100%;">
              <button style="padding: 8px 16px; background: transparent; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                Learn More
              </button>
              <div style="display: flex; gap: 8px;">
                <button @click="isVisible = false" style="padding: 8px 16px; background: transparent; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                  Cancel
                </button>
                <button @click="isVisible = false" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  Save Changes
                </button>
              </div>
            </div>
          </template>
        </Modal>
      </div>
    `
  })
}

export const DisabledConfirm: Story = {
  render: args => ({
    components: { Modal },
    setup() {
      const isVisible = ref(false)
      const agreed = ref(false)
      const openModal = () => {
        isVisible.value = true
        agreed.value = false
      }
      const handleConfirm = () => {
        isVisible.value = false
      }
      return { args, isVisible, agreed, openModal, handleConfirm }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Open Modal with Disabled Confirm
        </button>
        <Modal
          v-model:visible="isVisible"
          v-bind="args"
          title="Terms and Conditions"
          :confirmDisabled="!agreed"
          @confirm="handleConfirm"
        >
          <p>Please read and accept the terms and conditions:</p>
          <div style="margin: 16px 0; padding: 16px; background: #f5f5f5; border-radius: 8px; max-height: 200px; overflow-y: auto;">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" v-model="agreed" />
            <span>I agree to the terms and conditions</span>
          </label>
        </Modal>
      </div>
    `
  }),
  args: {
    showActions: true,
    confirmText: 'Accept',
    confirmDisabled: true
  }
}
