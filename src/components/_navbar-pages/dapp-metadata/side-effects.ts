import { getMetadata } from '@api/utils/resources'
import type {
  StateEntityDetailsResponse,
  StateEntityDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import type { Account } from '@stores'

export type FormattedAccount = Account & {
  dappDefinition: boolean
  name?: string
  description?: string
  domain?: string
}

const hasDAppDefinitionMetadata = (entity?: StateEntityDetailsResponseItem) =>
  !!entity?.metadata.items.find(
    (item) =>
      item.key === 'account_type' && item.value.as_string === 'dapp definition'
  )

export const getFormattedAccounts = (
  accounts: Account[],
  accountOverviews: StateEntityDetailsResponse
): FormattedAccount[] => {
  const overviews = accountOverviews.items.reduce((prev, next) => {
    prev[next.address] = next
    return prev
  }, {} as Record<string, StateEntityDetailsResponseItem>)

  return accounts.map(({ address, label }) => {
    const isDApp = hasDAppDefinitionMetadata(overviews[address])
    const metadata = overviews[address]?.metadata
    return {
      label: `${label}${isDApp ? ' - dApp definition' : ''}`,
      address,
      dappDefinition: isDApp,
      name: getMetadata('name')(metadata),
      description: getMetadata('description')(metadata),
      domain: getMetadata('domain')(metadata)
    }
  })
}
