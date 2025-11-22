<template>
  <div
    :class="[
      'table',
      `table_size-${size}`,
      { 'table_sticky': stickyHeader, 'table_striped': striped, 'table_hoverable': hoverable }
    ]"
  >
    <div class="table__wrapper">
      <table class="table__element">
        <thead class="table__thead">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="column.width ? { width: column.width } : undefined"
              :class="[
                'table__th',
                `table__th_align-${column.align ?? 'left'}`,
                { 'table__th_sortable': column.sortable, 'table__th_active': column.sortable && sortBy === column.key },
                column.headerClass,
                column.hideOnMobile ? 'table__th_hide-mobile' : ''
              ]"
              @click="handleSort(column)"
            >
              <span class="table__th-content">
                <slot :name="`header-${column.key}`" :column="column">
                  <span class="table__label">{{ column.label }}</span>
                </slot>
                <span
                  v-if="column.sortable"
                  :class="[
                    'table__sort',
                    {
                      'table__sort_active': sortBy === column.key,
                      'table__sort_desc': sortBy === column.key && sortOrder === 'desc'
                    }
                  ]"
                >
                  <Icon name="icon-chevron-down" :size="12" />
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody class="table__tbody">
          <tr
            v-for="(row, rowIndex) in rows"
            :key="resolveRowKey(row, rowIndex)"
            class="table__tr"
            @click="emitRowClick(row, rowIndex)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'table__td',
                `table__td_align-${column.align ?? 'left'}`,
                column.cellClass,
                column.hideOnMobile ? 'table__td_hide-mobile' : ''
              ]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getCellValue(row, column)"
                :column="column"
              >
                {{ formatValue(getCellValue(row, column)) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!rows.length" class="table__empty">
        <slot name="empty">
          {{ emptyText }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/shared/ui/icon/Icon.vue'

type SortOrder = 'asc' | 'desc'
type Align = 'left' | 'center' | 'right'

export type RowData = Record<string, unknown>

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: Align
  headerClass?: string
  cellClass?: string
  hideOnMobile?: boolean
  accessor?: (row: RowData) => unknown
}

interface Props {
  columns: TableColumn[]
  rows: RowData[]
  rowKey?: keyof RowData | ((row: RowData, index: number) => string | number)
  sortBy?: string
  sortOrder?: SortOrder
  stickyHeader?: boolean
  striped?: boolean
  hoverable?: boolean
  size?: 'md' | 'sm'
  emptyText?: string
}

interface Emits {
  (e: 'update:sortBy', value: string): void
  (e: 'update:sortOrder', value: SortOrder): void
  (e: 'sort-change', value: { sortBy: string; sortOrder: SortOrder }): void
  (e: 'row-click', value: { row: RowData; index: number }): void
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  sortBy: '',
  sortOrder: 'asc',
  stickyHeader: false,
  striped: false,
  hoverable: false,
  size: 'md',
  emptyText: 'No data'
})

const emit = defineEmits<Emits>()

function handleSort(column: TableColumn) {
  if (!column.sortable) return
  const nextOrder: SortOrder =
    props.sortBy === column.key ? (props.sortOrder === 'asc' ? 'desc' : 'asc') : 'desc'
  emit('update:sortBy', column.key)
  emit('update:sortOrder', nextOrder)
  emit('sort-change', { sortBy: column.key, sortOrder: nextOrder })
}

function getCellValue(row: RowData, column: TableColumn) {
  if (typeof column.accessor === 'function') {
    return column.accessor(row)
  }
  return row[column.key]
}

function resolveRowKey(row: RowData, index: number) {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }
  if (props.rowKey) {
    const value = row[props.rowKey]
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'symbol') {
      return value
    }
  }
  return index
}

function emitRowClick(row: RowData, index: number) {
  emit('row-click', { row, index })
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return value
  return JSON.stringify(value)
}
</script>

<style lang="scss" scoped src="./Table.scss"></style>
