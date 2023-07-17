import { sort } from './sorting'

const createEntry = (a: number | string) => ({ a })

describe('sorting', () => {
  describe('default function', () => {
    it('should sort ascending', () => {
      const entries = [createEntry(20), createEntry(10), createEntry(15)]

      expect(
        sort(entries, { property: 'a', sortable: true }, 'ascending')
      ).toEqual([createEntry(10), createEntry(15), createEntry(20)])
    })

    it('should sort descending', () => {
      const entries = [createEntry(20), createEntry(10), createEntry(15)]

      expect(
        sort(entries, { property: 'a', sortable: true }, 'descending')
      ).toEqual([createEntry(20), createEntry(15), createEntry(10)])
    })
  })

  describe('custom function', () => {
    it('should preserve order', () => {
      const entries = [
        createEntry(20),
        createEntry(21),
        createEntry(10),
        createEntry(15)
      ]

      expect(
        sort(entries, { property: 'a', sortable: (a, b) => 0 }, 'descending')
      ).toEqual([
        createEntry(20),
        createEntry(21),
        createEntry(10),
        createEntry(15)
      ])
      expect(
        sort(entries, { property: 'a', sortable: (a, b) => 0 }, 'ascending')
      ).toEqual([
        createEntry(20),
        createEntry(21),
        createEntry(10),
        createEntry(15)
      ])
    })

    it('should sort by custom function', () => {
      const entries = [
        createEntry('aaaa'),
        createEntry('bb'),
        createEntry('ccccc')
      ]
      expect(
        sort(
          entries,
          {
            property: 'a',
            sortable: (a, b) => (a.a.length > b.a.length ? 1 : -1)
          },
          'ascending'
        )
      ).toEqual([createEntry('bb'), createEntry('aaaa'), createEntry('ccccc')])
    })
  })
})
