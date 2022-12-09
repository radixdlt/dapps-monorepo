import {
  transformEntityOverview,
  transformEntityResources
} from './transformations'

describe('#transformations for queries', () => {
  it('Should transform entity resources', () => {
    const entityResources = {
      address:
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      fungible_resources: {
        total_count: 1,
        items: [
          {
            address: '0x000000000',
            amount: {
              value: '1000000000000000000',
              address: '0x000000000'
            }
          }
        ]
      },
      non_fungible_resources: {
        total_count: 1,
        items: [
          {
            address: '0x000000000',
            amount: 1
          }
        ]
      }
    }
    const transformed = transformEntityResources(entityResources)
    expect(transformed).to.deep.equal({
      fungible: [
        {
          address: '0x000000000',
          amount: '1000000000000000000'
        }
      ],
      nonFungible: [
        {
          address: '0x000000000',
          amount: '1'
        }
      ]
    })
  })

  it('Should extract amount for each entity', () => {
    const resources = [
      {
        address: '0x000000000',
        amount: '1000000000000000000'
      },
      {
        address: '0x000000001',
        amount: '2000000000000000000'
      },
      {
        address: '0x000000002',
        amount: '3000000000000000000'
      }
    ]
    const overview = {
      entities: [
        {
          address: '0x000000000',
          metadata: {
            items: [
              {
                key: 'name',
                value: 'test'
              }
            ]
          }
        },
        {
          address: '0x000000001',
          metadata: {
            items: [
              {
                key: 'name',
                value: 'test'
              }
            ]
          }
        }
      ]
    }
    const transformed = transformEntityOverview({ resources, overview })
    const expectedWithOverviews = [
      {
        address: '0x000000000',
        amount: '1000000000000000000',
        metadata: {
          items: [
            {
              key: 'name',
              value: 'test'
            }
          ]
        }
      },
      {
        address: '0x000000001',
        amount: '2000000000000000000',
        metadata: {
          items: [
            {
              key: 'name',
              value: 'test'
            }
          ]
        }
      }
    ]
    const expectedWithoutOverviews = [
      {
        address: '0x000000002',
        amount: '3000000000000000000'
      }
    ]
    expect(transformed).to.deep.equal({
      withOverviews: expectedWithOverviews,
      withoutOverviews: expectedWithoutOverviews
    })
  })
})
