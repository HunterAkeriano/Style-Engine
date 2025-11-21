import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from './Icon.vue'

const ICONS = [
  'icon-logo',
  'icon-menu',
  'icon-close',
  'icon-arrow-down',
  'icon-chevron-down',
  'icon-sun',
  'icon-moon',
  'icon-user',
  'icon-logout',
  'icon-search'
]

const meta = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: ICONS },
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
    className: { control: 'text' }
  },
  args: {
    name: 'icon-sun',
    size: 32
  }
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: args => ({
    components: { Icon },
    setup() {
      return { args }
    },
    template: '<Icon v-bind="args" />'
  })
}
