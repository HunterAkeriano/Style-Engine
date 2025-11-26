import type { Meta, StoryObj } from '@storybook/vue3'
import CodeExport from './CodeExport.vue'
import type { SelectOption } from '@/shared/ui'

const meta = {
  title: 'UI/CodeExport',
  component: CodeExport,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    filename: { control: 'text' },
    showSaveButton: { control: 'boolean' },
    allowExport: { control: 'boolean' },
    onSave: { action: 'saved' },
    'onBlocked-export': { action: 'export-blocked' }
  },
  args: {
    title: 'Export Code',
    filename: 'styles',
    showSaveButton: true,
    allowExport: true
  }
} satisfies Meta<typeof CodeExport>

export default meta
type Story = StoryObj<typeof meta>

const gradientCode = {
  css: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`,
  scss: `$gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\nbackground: $gradient;`,
  sass: `$gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)\nbackground: $gradient`,
  stylus: `gradient = linear-gradient(135deg, #667eea 0%, #764ba2 100%)\nbackground gradient`,
  inline: `style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"`
}

const getGradientCode = (format: string | number) => {
  return gradientCode[format as keyof typeof gradientCode] || gradientCode.css
}

export const Default: Story = {
  args: {
    getCode: getGradientCode
  }
}

const customFormats: SelectOption[] = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'JSON', value: 'json' }
]

const codeMap = {
  js: `const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';`,
  ts: `const gradient: string = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';`,
  json: `{\n  "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"\n}`
}

const getCustomCode = (format: string | number) => {
  return codeMap[format as keyof typeof codeMap] || codeMap.js
}

export const WithCustomFormats: Story = {
  args: {
    title: 'Custom Formats',
    filename: 'config',
    getCode: getCustomCode,
    formatOptions: customFormats
  }
}

export const WithoutSaveButton: Story = {
  args: {
    showSaveButton: false,
    getCode: getGradientCode
  }
}

export const ExportDisabled: Story = {
  args: {
    allowExport: false,
    title: 'Export Disabled',
    getCode: getGradientCode
  }
}

const longCodeMap = {
  css: `/* Complex gradient */
.gradient-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.gradient-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}`,
  scss: `// Complex gradient
$gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

.gradient-box {
  background: $gradient-primary;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
}`,
  sass: `// Complex gradient
$gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

.gradient-box
  background: $gradient-primary
  border-radius: 12px
  padding: 2rem
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2)
  transition: all 0.3s ease

  &:hover
    transform: translateY(-5px)
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3)`,
  stylus: `// Complex gradient
gradient-primary = linear-gradient(135deg, #667eea 0%, #764ba2 100%)

.gradient-box
  background gradient-primary
  border-radius 12px
  padding 2rem
  box-shadow 0 10px 30px rgba(0, 0, 0, 0.2)
  transition all 0.3s ease

  &:hover
    transform translateY(-5px)
    box-shadow 0 15px 40px rgba(0, 0, 0, 0.3)`,
  inline: `style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;"`
}

const getLongCode = (format: string | number) => {
  return longCodeMap[format as keyof typeof longCodeMap] || longCodeMap.css
}

export const LongCode: Story = {
  args: {
    title: 'Complex Styles',
    filename: 'gradient-box',
    getCode: getLongCode
  }
}
