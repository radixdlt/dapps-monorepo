import { WorkbookClient } from './workbook-client'

describe('workbook client', () => {
  it('should initialize without throw', () => {
    expect(() => WorkbookClient({ toDate: new Date() })).not.toThrow()
  })

  it('should only add TXs before toDate', async () => {
    const client = WorkbookClient({ toDate: new Date('2021-01-01') })
    client.addRows([
      {
        round_timestamp: '2019-01-01',
        intent_hash: 'intent_hash_1'
      },
      {
        round_timestamp: '2022-01-01',
        intent_hash: 'intent_hash_3'
      }
    ] as any[])

    const csvBufferString = (await client.csvBuffer()).toString()

    expect(csvBufferString).toContain('intent_hash_1')
    expect(csvBufferString).not.toContain('intent_hash_3')
  })
})
