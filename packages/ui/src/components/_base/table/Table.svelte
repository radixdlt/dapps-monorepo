<script lang="ts" context="module">
  import type BigNumber from 'bignumber.js'

  export const sort = <E extends Entry>(
    entries: E[],
    column: TableColumn<E>,
    direction: 'ascending' | 'descending'
  ) => {
    if (!column.sortBy) {
      return entries
    }

    const defaultSortFn = (a: E, b: E) => {
      const property = column.sortBy as keyof E

      if (['string', 'number', 'boolean'].includes(typeof a[property])) {
        return sortBasic(a[property], b[property])
      } else {
        return sortBigNumber(a[property], b[property])
      }
    }

    const sortFn =
      typeof column.sortBy === 'function' ? column.sortBy : defaultSortFn

    return [...entries].sort((a, b) => {
      const output = sortFn(a, b)
      return direction === 'descending' ? output : output * -1
    })
  }

  const sortBasic = <T extends string | number | boolean>(a: T, b: T) => {
    if (a === b) {
      return 0
    }

    return a < b ? -1 : 1
  }

  const sortBigNumber = (a: BigNumber, b: BigNumber) => {
    if (a.eq(b)) {
      return 0
    }

    return a.lt(b) ? -1 : 1
  }

  export type Entry = { [key: string | number | symbol]: any }

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
     * Can be a sortable entry in the provided entries, or a custom sort function. Leave unset if the column is not sortable.
     */
    sortBy?: SortableValues<Entry> | ((a: Entry, b: Entry) => number)

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

  let sortedEntries: T[] = []
  let lastSortedBy: number
  let ascendingSort = true
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
