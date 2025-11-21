import type { Meta, StoryObj } from '@storybook/vue3'
import Card from './Card.vue'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated']
    },
    hoverable: { control: 'boolean' }
  },
  args: {
    variant: 'default',
    hoverable: false
  }
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const Template = (args: any) => ({
  components: { Card },
  setup() {
    return { args }
  },
  template: `
    <Card v-bind="args">
      <template #header>
        <strong>Header slot</strong>
      </template>
      Main card content goes here. Use slots to layout anything you need.
      <template #footer>
        <small>Footer actions</small>
      </template>
    </Card>
  `
})

export const Default: Story = {
  render: Template
}

export const ElevatedHoverable: Story = {
  render: Template,
  args: {
    variant: 'elevated',
    hoverable: true
  }
}
