import type { Meta, StoryObj } from '@storybook/vue3'
import NavLink from './NavLink.vue'

const meta = {
  title: 'UI/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  argTypes: {
    to: { control: 'text' },
    className: { control: 'text' },
    click: { action: 'clicked' }
  },
  args: {
    to: '/gradient',
    className: 'nav-link__demo'
  }
} satisfies Meta<typeof NavLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NavLink },
    setup() {
      return { args }
    },
    template: `<NavLink v-bind="args">Back to generator</NavLink>`
  })
}
