import { transformWithOverview } from './transformers'

describe('#transform for account fetching', () => {
  it('Should transform with overview', () => {
    const overview = [
      {
        address: '0x1',
        amount: '100',
        metadata: {
          items: [
            {
              key: 'name',
              value: 'name'
            },
            {
              key: 'symbol',
              value: 'symbol'
            }
          ]
        }
      }
    ]
    const transformedOverview = transformWithOverview(overview)
    expect(transformedOverview).toEqual({ symbol: '100' })
  })
})
