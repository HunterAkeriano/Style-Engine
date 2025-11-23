import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import Select from './Select.vue'
import type { SelectOption } from './types'

const options: SelectOption[] = [
  { label: 'Gradient', value: 'gradient' },
  { label: 'Shadow', value: 'shadow' },
  { label: 'Animation', value: 'animation' }
]

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { action: 'changed' },
    'onUpdate:modelValue': { action: 'update' }
  },
  args: {
    label: 'Select generator',
    placeholder: 'Choose option',
    options,
    disabled: false,
    required: false,
    hint: ''
  }
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const Template = (args: any) => ({
  components: { Select },
  setup() {
    const value = ref(args.modelValue ?? options[0].value)
    return { args, value }
  },
  template: '<Select v-model="value" v-bind="args" />'
})

export const Default: Story = {
  render: Template,
  args: {
    modelValue: options[0].value,
    hint: 'Opens as dropdown; switches to drop-up if not enough space'
  }
}

export const ErrorState: Story = {
  render: Template,
  args: {
    modelValue: '',
    error: 'Please pick a value'
  }
}

export const Disabled: Story = {
  render: Template,
  args: {
    modelValue: options[1].value,
    disabled: true
  }
}
