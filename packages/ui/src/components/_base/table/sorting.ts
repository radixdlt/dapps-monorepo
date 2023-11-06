import type BigNumber from 'bignumber.js'
import type { Direction, Entry, TableColumn } from './types'

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

export const useSorting = <T extends Entry>(
  columns: (TableColumn<T> | null)[],
  entries: T[],
  defaultSortedColumn?: string
) => {
  let sortedEntries: T[] = []
  let lastSortedBy: number | undefined = undefined
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

  return {
    sortedEntries,
    sortColumn,
    sortStatus,
    lastSortedBy
  }
}
