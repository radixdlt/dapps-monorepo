<script lang="ts" context="module">
  import type BigNumber from 'bignumber.js'

  export type Direction = 'ascending' | 'descending'

  export const sortBasic = <T extends string | number | boolean>(
    a: T,
    b: T,
    direction: Direction
  ) => {
    if (a === b) {
      return 0
    }

    return a < b
      ? direction === 'ascending'
        ? -1
        : 1
      : direction === 'ascending'
      ? 1
      : -1
  }

  export const sortBigNumber = (
    a: BigNumber,
    b: BigNumber,
    direction: Direction
  ) => {
    if (a.eq(b)) {
      return 0
    }

    return a.lt(b)
      ? direction === 'ascending'
        ? -1
        : 1
      : direction === 'ascending'
      ? 1
      : -1
  }

  export const sort = <E extends Entry>(
    entries: E[],
    column: TableColumn<E>,
    direction: Direction
  ) => {
    if (!column.sortBy) {
      return entries
    }

    const defaultSortFn = (a: E, b: E, direction: Direction) => {
      const property = column.sortBy as keyof E

      if (['string', 'number', 'boolean'].includes(typeof a[property])) {
        return sortBasic(a[property], b[property], direction)
      } else {
        return sortBigNumber(a[property], b[property], direction)
      }
    }

    const sortFn =
      typeof column.sortBy === 'function' ? column.sortBy : defaultSortFn

    return [...entries].sort((a, b) => sortFn(a, b, direction))
  }

  export type Entry = { [key: string | number | symbol]: any }

  export type TablePage<T> = {
    next_cursor?: string | null
    previous_cursor?: string | null
    items: T[]
  }

  export type SortableType = BigNumber | string | number | boolean

  export type SortableValues<T> = {
    [K in keyof T]: T[K] extends SortableType ? K : never
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
    }
  }
</script>

<script lang="ts">
  type T = $$Generic<Entry>

  export let entries: T[]
  export let columns: (TableColumn<T> | null)[]
  export let defaultSortedColumn:
    | NonNullable<(typeof columns)[number]>['id']
    | undefined = undefined

  let sortedEntries: T[] = []
  let lastSortedBy: number
  let ascendingSort = false
  let sortStatus: ('ascending' | 'descending' | 'unsorted')[] = Array(
    columns.length
  ).fill('unsorted')

  const sortColumn = (column: (typeof columns)[number], index: number) => {
    if (!column || !column.sortBy) return

    if (lastSortedBy) {
      sortStatus[lastSortedBy] = 'unsorted'
    }

    ascendingSort = index === lastSortedBy ? !ascendingSort : false

    lastSortedBy = index
    const direction = ascendingSort ? 'ascending' : 'descending'
    sortStatus[index] = direction

    sortedEntries = sort(entries, column, direction)
  }

  if (defaultSortedColumn) {
    const column = columns.find((c) => c?.id === defaultSortedColumn)!
    sortColumn(column, columns.indexOf(column))
  }
</script>

<table>
  <thead class="desktop-only">
    <tr>
      <slot name="header" sort={sortColumn} {sortStatus}>
        {#each columns as column, i}
          <th style:text-align={column?.header?.alignment ?? 'left'}>
            <slot
              name="header-cell"
              {column}
              sort={() => sortColumn(column, i)}
              sortStatus={sortStatus[i]}
            />
          </th>
        {/each}
      </slot>
    </tr>
  </thead>

  <tbody>
    {#each lastSortedBy ? sortedEntries : entries as entry}
      <slot name="empty-row" {entry}>
        <tr>
          <slot name="row" {entry} />
        </tr>
      </slot>
    {/each}
  </tbody>
</table>
