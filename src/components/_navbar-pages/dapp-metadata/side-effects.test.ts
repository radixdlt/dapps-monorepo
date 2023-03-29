import type { StateEntityDetailsResponse } from '@radixdlt/babylon-gateway-api-sdk'
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
      items: [
        {
          address: 'xxx',
          metadata: {
            items: [
              {
                key: 'name',
                value: {
                  as_string: 'name'
                }
              },
              {
                key: 'description',
                value: {
                  as_string: 'description'
                }
              },
              {
                key: 'domain',
                value: {
                  as_string: 'domain'
                }
              },
              {
                key: 'account_type',
                value: {
                  as_string: 'dapp definition'
                }
              }
            ]
          }
        }
      ]
    } as StateEntityDetailsResponse
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
