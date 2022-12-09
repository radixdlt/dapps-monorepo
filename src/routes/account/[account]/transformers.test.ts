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
    expect(transformedOverview).toEqual({ 'symbol (name)': '100' })
  })

  it('Should transform according to a prioritzed list', () => {
    const overview = [
      {
        address: '0x1',
        amount: '100',
        metadata: {
          items: [
            {
              key: 'name',
              value: 'name1'
            },
            {
              key: 'symbol',
              value: 'symbol1'
            }
          ]
        }
      },
      {
        address: '0x2',
        amount: '200',
        metadata: {
          items: [
            {
              key: 'symbol',
              value: 'symbol3'
            }
          ]
        }
      },
      {
        address: '0x3',
        amount: '300',
        metadata: {
          items: [
            {
              key: 'name',
              value: 'name2'
            }
          ]
        }
      }
    ]
    const transformedOverview = transformWithOverview(overview)
    expect(transformedOverview).toEqual({
      'symbol1 (name1)': '100',
      symbol3: '200',
      name2: '300'
    })
  })
})
