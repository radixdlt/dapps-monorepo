import dayjs from '@common/utils/dayjs'
import { WorkbookClient } from './workbook-client'
import { ResourceCacheClient } from '@common/api/utils/resource-cache-client'

describe('workbook client', () => {
  it('should initialize without throw', () => {
    expect(() =>
      WorkbookClient({
        toDate: dayjs.utc(),
        entityAddress: 'abc',
        resourcesCacheClient: ResourceCacheClient()
      })
    ).not.toThrow()
  })

  it('should only add TXs before toDate', async () => {
    const client = WorkbookClient({
      toDate: dayjs.utc('2021-01-01'),
      entityAddress: 'abc',
      resourcesCacheClient: ResourceCacheClient()
    })
    client.addRows([
      {
        balance_changes: {
          fungible_balance_changes: [
            {
              entity_address: 'abc',
              resource_address: 'abc',
              balance_change: '1'
            }
          ],
          non_fungible_balance_changes: []
        },
        round_timestamp: '2019-01-01',
        intent_hash: 'intent_hash_1'
      },
      {
        balance_changes: {
          fungible_balance_changes: [
            {
              entity_address: 'abc',
              resource_address: 'abc',
              balance_change: '1'
            }
          ],
          non_fungible_balance_changes: []
        },
        round_timestamp: '2022-01-01',
        intent_hash: 'intent_hash_3'
      }
    ] as any[])

    const csvBufferString = (await client.csvBuffer()).toString()

    expect(csvBufferString).toContain('intent_hash_1')
    expect(csvBufferString).not.toContain('intent_hash_3')
  })
})
