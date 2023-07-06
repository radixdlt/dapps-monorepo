import type { SvelteComponent } from 'svelte'

export type TableConfig<Entry = any> = {
  columns: TableColumn<Entry>[]
}

export type TablePage<T> = {
  next_cursor?: string | null;
  previous_cursor?: string | null;
  items: T[]
}

export type TableColumn<Entry = any> = {
  /**
   * The label of the column which will be displayed as column header
   */
  label?: string
  /**
   * Whether the column is sortable or not. If a function is provided, it will be used as a custom sort function.
   */
  sortable?: boolean | ((a: Entry, b: Entry) => number)
  /**
   * Object property to be used for displaying the content of the column. It can be overriden either by `transform` or `component`
   */
  property?: keyof Entry
  /**
   * Custom function to be called before rendering text content
   */
  transform?: (entry: Entry) => string
  /**
   * Component to be rendered instead of text content
   */
  component?: new (...args: any[]) => SvelteComponent
  componentProps?: Record<string, string | number | boolean | Record<string, any> | ((value: Entry) => any)>
}
