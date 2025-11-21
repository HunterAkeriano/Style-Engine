import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import Input from './Input.vue'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url']
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    readonly: { control: 'boolean' },
    blur: { action: 'blurred' },
    focus: { action: 'focused' }
  },
  args: {
    type: 'text',
    label: 'Label',
    placeholder: 'Placeholder',
    disabled: false,
    required: false,
    readonly: false,
    hint: ''
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const Template = (args: any) => ({
  components: { Input },
  setup() {
    const value = ref(args.modelValue ?? '')
    return { args, value }
  },
  template: '<Input v-model="value" v-bind="args" />'
})

export const Default: Story = {
  render: Template,
  args: {
    modelValue: '',
    hint: 'Helper text for the input'
  }
}

export const WithError: Story = {
  render: Template,
  args: {
    modelValue: 'Invalid value',
    error: 'Validation error message'
  }
}

export const WithAffixes: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('123')
      return { value }
    },
    template: `
      <Input v-model="value" label="With prefix/suffix" placeholder="0" hint="Affixes are slots">
        <template #prefix>+38</template>
        <template #suffix>UA</template>
      </Input>
    `
  })
}
