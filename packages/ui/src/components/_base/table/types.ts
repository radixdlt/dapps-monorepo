import type BigNumber from 'bignumber.js'
import type { SvelteComponent } from 'svelte'

export type Entry = { [key: string | number | symbol]: any }

export type TableConfig<E extends Entry> = {
  columns: (TableColumn<E> | null)[]
}

export type TablePage<T> = {
  next_cursor?: string | null
  previous_cursor?: string | null
  items: T[]
}

export type SortableType = BigNumber | string | number | boolean

type SortableValues<T> = {
  [K in keyof T]: T[K] extends SortableType ? K : never
}[keyof T]

export type TableColumn<Entry = any> = {
  /**
   * The label of the column which will be displayed as column header.
   */
  label?: string

  /**
   * Can be a sortable entry in the provided entries, or a custom sort function. Leave unset if the column is not sortable.
   */
  sortBy?: SortableValues<Entry> | ((a: Entry, b: Entry) => number)

  /**
   * The id of the column. This is used to identify the column when rendering a custom component using slots.
   */
  id?: string

  /**
   * For rendering a simple value. Returns a string that will be displayed in the cell.
   */
  renderAs?: (entry: Entry) => string

  /**
   * Component to be rendered instead of text content
   */
  component?: new (...args: any[]) => SvelteComponent
  componentProps?: Record<
    string,
    string | number | boolean | Record<string, any> | ((value: Entry) => any)
  >
}
