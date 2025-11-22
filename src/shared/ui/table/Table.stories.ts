import type { Meta, StoryObj } from '@storybook/vue3'
import Table, { type TableColumn } from './Table.vue'

type Row = {
  name: string
  email: string
  status: string
  joined: string
}

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true, width: '40%' },
  { key: 'joined', label: 'Joined', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'right' }
]

const rows: Row[] = [
  { name: 'Ava Collins', email: 'ava@ui.dev', status: 'premium', joined: '2023-02-12' },
  { name: 'Noah Miller', email: 'noah@css.dev', status: 'pro', joined: '2023-03-08' },
  { name: 'Mia Rossi', email: 'mia@design.dev', status: 'free', joined: '2023-05-19' }
]

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    striped: { control: 'boolean' },
    hoverable: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    size: { control: { type: 'select' }, options: ['md', 'sm'] },
    'onSort-change': { action: 'sort' }
  },
  args: {
    columns,
    rows,
    sortBy: 'name',
    sortOrder: 'asc',
    striped: true,
    hoverable: true,
    stickyHeader: false,
    size: 'md',
    emptyText: 'Nothing to show'
  }
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const Template = (args: any) => ({
  components: { Table },
  setup() {
    return { args }
  },
  template: `
    <div style="max-width: 900px">
      <Table v-bind="args" @sort-change="args['onSort-change']">
        <template #cell-status="{ value }">
          <span style="text-transform: capitalize">{{ value }}</span>
        </template>
      </Table>
    </div>
  `
})

export const Default: Story = {
  render: Template
}

export const Empty: Story = {
  render: Template,
  args: {
    rows: []
  }
}
