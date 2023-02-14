import type { EntityOverviewResponse } from '@radixdlt/babylon-gateway-api-sdk'
import { getFormattedAccounts } from './side-effects'

describe('DappMetadata side effects', () => {
  it('should corretly match accounts with gateway response', () => {
    const accounts = [
      {
        address: 'xxx',
        label: 'label'
      },
      {
        address: 'yyy',
        label: 'label'
      }
    ]
    const overviewResponse = {
      ledger_state: {},
      entities: [
        {
          address: 'xxx',
          metadata: {
            items: [
              {
                key: 'name',
                value: 'name'
              },
              {
                key: 'description',
                value: 'description'
              },
              {
                key: 'domain',
                value: 'domain'
              },
              {
                key: 'account_type',
                value: 'dapp definition'
              }
            ]
          }
        }
      ]
    } as EntityOverviewResponse
    const expected = [
      {
        address: 'xxx',
        label: 'label - dApp definition',
        name: 'name',
        description: 'description',
        domain: 'domain',
        dappDefinition: true
      },
      {
        address: 'yyy',
        label: 'label',
        dappDefinition: false,
        name: undefined,
        domain: undefined,
        description: undefined
      }
    ]
    expect(getFormattedAccounts(accounts, overviewResponse)).toStrictEqual(
      expected
    )
  })
})
