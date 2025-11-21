import type { Meta, StoryObj } from '@storybook/vue3'
import Logo from './Logo.vue'

const meta = {
  title: 'UI/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Clickable logo that links to the home route and uses the shared SVG sprite.'
      }
    }
  }
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Logo },
    template: '<Logo />'
  })
}
