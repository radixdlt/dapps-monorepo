import BigNumber from 'bignumber.js'
import { sort } from './sorting'

const createEntry = (a: BigNumber | string) => ({ a })

describe('sorting', () => {
  describe('default function', () => {
    it('should sort ascending', () => {
      const entries = [
        createEntry(new BigNumber(20)),
        createEntry(new BigNumber(10)),
        createEntry(new BigNumber(15))
      ]

      //@ts-ignore
      expect(sort({ sortBy: 'a' }, 'ascending')(entries)).toEqual([
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
      //@ts-ignore
      expect(sort({ sortBy: 'a' }, 'descending')(entries)).toEqual([
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
      //@ts-ignore
      expect(sort({ sortBy: (a, b) => 0 }, 'descending')(entries)).toEqual([
        createEntry(new BigNumber(20)),
        createEntry(new BigNumber(21)),
        createEntry(new BigNumber(10)),
        createEntry(new BigNumber(15))
      ])
      //@ts-ignore
      expect(sort({ sortBy: (a, b) => 0 }, 'ascending')(entries)).toEqual([
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
          //@ts-ignore
          {
            sortBy: (a, b) =>
              a.a.toString().length > b.a.toString().length ? 1 : -1
          },
          'ascending'
        )(entries)
      ).toEqual([
        createEntry(new BigNumber('b)b')),
        createEntry(new BigNumber('a)aaa')),
        createEntry(new BigNumber('c)cccc'))
      ])
    })
  })
})
