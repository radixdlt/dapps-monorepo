import type BigNumber from 'bignumber.js'

export type Direction = 'ascending' | 'descending'

export type Entry = { [key: string | number | symbol]: any }

export type TablePage<T> = {
  next_cursor?: string | null
  previous_cursor?: string | null
  items: T[]
}

export type SortableType = BigNumber | string | number | boolean

export type SortableValues<T> = {
  [K in keyof T]: T[K] extends SortableType | undefined ? K : never
}[keyof T]

export type TableColumn<Entry = any> = {
  /**
   * A unique id.
   */
  id?: string

  /**
   * Can be a sortable entry in the provided entries, or a custom sort function. Leave unset if the column is not sortable.
   */
  sortBy?:
    | SortableValues<Entry>
    | ((a: Entry, b: Entry, direction: Direction) => number)

  /**
   * Header options.
   */
  header?: {
    label?: string
    alignment?: 'left' | 'right' | 'center'
    tooltip?: string
  }
}
