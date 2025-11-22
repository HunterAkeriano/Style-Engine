export type ColumnAlign = 'left' | 'center' | 'right'

export interface AboutUsersTableColumnDef {
  key: 'avatar' | 'name' | 'email' | 'createdAt' | 'subscriptionTier'
  labelKey: string
  sortable?: boolean
  width?: string
  align?: ColumnAlign
  hideOnMobile?: boolean
}

export const ABOUT_USERS_TABLE_COLUMNS: AboutUsersTableColumnDef[] = [
  { key: 'avatar', labelKey: 'ABOUT.TABLE.AVATAR', width: '72px' },
  { key: 'name', labelKey: 'ABOUT.TABLE.NAME', sortable: true },
  {
    key: 'email',
    labelKey: 'ABOUT.TABLE.EMAIL',
    sortable: true,
    hideOnMobile: true
  },
  {
    key: 'createdAt',
    labelKey: 'ABOUT.TABLE.JOINED',
    sortable: true,
    hideOnMobile: true
  },
  {
    key: 'subscriptionTier',
    labelKey: 'ABOUT.TABLE.STATUS',
    sortable: true,
    align: 'right'
  }
]
