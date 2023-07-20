import type BigNumber from 'bignumber.js'
import type { Entry, TableColumn } from './types'

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

    if (['string', 'number', 'boolean'].includes(a[property])) {
      return sortBasic(a[property], b[property])
    } else {
      return sortBigNumber(a[property], b[property])
    }
  }

  const sortFn =
    typeof column.sortBy === 'function' ? column.sortBy : defaultSortFn

  return [...entries].sort((a, b) => {
    const output = sortFn(a, b)
    return direction === 'ascending' ? output : output * -1
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
