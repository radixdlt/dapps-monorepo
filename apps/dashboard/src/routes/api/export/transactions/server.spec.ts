import { getDownloadLink } from '@dashboard-pages/search-pages/export-csv-button/side-effects'
import { setup, $fetch } from 'vite-test-utils'

await setup({
  server: true
})

describe('export transactions api', () => {
  describe('validations', () => {
    it('should validate missing data', async () => {
      try {
        await $fetch(getDownloadLink('', '', ''), {
          method: 'GET'
        })
      } catch (e: any) {
        expect(e.statusCode).toBe(400)
        expect(e.data).toEqual(`{"message":"Missing data"}`)
      }
    })

    it('should validate wrong dates', async () => {
      try {
        await $fetch(getDownloadLink('abc', 'ab', 'aa'), {
          method: 'GET'
        })
      } catch (e: any) {
        expect(e.statusCode).toBe(400)
        expect(e.data).toEqual(`{"message":"Invalid date"}`)
      }
    })

    it('should validate entity address', async () => {
      try {
        await $fetch(getDownloadLink('2022-12-12', '2022-12-12', 'abc'), {
          method: 'GET'
        })
      } catch (e: any) {
        expect(e.statusCode).toBe(400)
        expect(e.data).toEqual(`{"message":"Invalid address"}`)
      }
    })

    it('should validate date range', async () => {
      try {
        await $fetch(
          getDownloadLink(
            '2022-10-10',
            '2021-12-12',
            'account_tdx_2_12xe9tn7ns389ervyuwxkhyyrscfyjug00y8a4lhk5hwt4lfq9jarft'
          ),
          {
            method: 'GET'
          }
        )
      } catch (e: any) {
        expect(e.statusCode).toBe(400)
        expect(e.data).toEqual(`{"message":"From date must be before to date"}`)
      }
    })
  })
})
