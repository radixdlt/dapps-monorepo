import type { TableColumn } from './types'

export const sort = (
  entries: unknown[],
  column: TableColumn,
  direction: 'ascending' | 'descending'
) => {
  const property = column?.property

  if (!property || !column?.sortable) {
    return entries
  }

  const defaultSortFn = (a: any, b: any) => {
    if (a[property] === b[property]) {
      return 0
    }

    return a[property] < b[property] ? -1 : 1
  }
  const sortFn =
    typeof column.sortable === 'function' ? column.sortable : defaultSortFn

  return entries.sort((a, b) => {
    const output = sortFn(a, b)
    return direction === 'ascending' ? output : output * -1
  })
}
