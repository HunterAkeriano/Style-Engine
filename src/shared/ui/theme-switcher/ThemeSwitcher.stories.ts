import type { Meta, StoryObj } from '@storybook/vue3'
import ThemeSwitcher from './ThemeSwitcher.vue'

const meta = {
  title: 'UI/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Toggles light/dark theme using the shared `useTheme` composable and localized labels.'
      }
    }
  }
} satisfies Meta<typeof ThemeSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ThemeSwitcher },
    template: '<ThemeSwitcher />'
  })
}
