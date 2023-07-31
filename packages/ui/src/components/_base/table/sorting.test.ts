import BigNumber from 'bignumber.js'
import { sort } from './Table.svelte'

const createEntry = (a: BigNumber | string) => ({ a })

describe('sorting', () => {
  describe('default function', () => {
    it('should sort ascending', () => {
      const entries = [
        createEntry(new BigNumber(20)),
        createEntry(new BigNumber(10)),
        createEntry(new BigNumber(15))
      ]

      expect(sort(entries, { sortBy: 'a' }, 'ascending')).toEqual([
        createEntry(new BigNumber(10)),
        createEntry(new BigNumber(15)),
        createEntry(new BigNumber(20))
      ])
    })

    it('should sort descending', () => {
      const entries = [
        createEntry(new BigNumber(20)),
        createEntry(new BigNumber(10)),
        createEntry(new BigNumber(15))
      ]

      expect(sort(entries, { sortBy: 'a' }, 'descending')).toEqual([
        createEntry(new BigNumber(20)),
        createEntry(new BigNumber(15)),
        createEntry(new BigNumber(10))
      ])
    })
  })

  describe('custom function', () => {
    it('should preserve order', () => {
      const entries = [
        createEntry(new BigNumber(20)),
        createEntry(new BigNumber(21)),
        createEntry(new BigNumber(10)),
        createEntry(new BigNumber(15))
      ]

      expect(sort(entries, { sortBy: (a, b) => 0 }, 'descending')).toEqual([
        createEntry(new BigNumber(20)),
        createEntry(new BigNumber(21)),
        createEntry(new BigNumber(10)),
        createEntry(new BigNumber(15))
      ])
      expect(sort(entries, { sortBy: (a, b) => 0 }, 'ascending')).toEqual([
        createEntry(new BigNumber(20)),
        createEntry(new BigNumber(21)),
        createEntry(new BigNumber(10)),
        createEntry(new BigNumber(15))
      ])
    })

    it('should sort by custom function', () => {
      const entries = [
        createEntry(new BigNumber('a)aaa')),
        createEntry(new BigNumber('b)b')),
        createEntry(new BigNumber('c)cccc'))
      ]
      expect(
        sort(
          entries,
          {
            sortBy: (a, b) =>
              a.a.toString().length > b.a.toString().length ? 1 : -1
          },
          'ascending'
        )
      ).toEqual([
        createEntry(new BigNumber('b)b')),
        createEntry(new BigNumber('a)aaa')),
        createEntry(new BigNumber('c)cccc'))
      ])
    })
  })
})
