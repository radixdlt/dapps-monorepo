import type {
  EntityOverviewResponse,
  EntityOverviewResponseEntityItem
} from '@radixdlt/babylon-gateway-api-sdk'
import type { Account } from '@stores'

export type FormattedAccount = Account & {
  dappDefinition: boolean
  name?: string
  description?: string
  domain?: string
}

const hasDAppDefinitionMetadata = (entity?: EntityOverviewResponseEntityItem) =>
  !!entity?.metadata.items.find(
    (item) => item.key === 'account_type' && item.value === 'dapp definition'
  )

export const getFormattedAccounts = (
  accounts: Account[],
  accountOverviews: EntityOverviewResponse
): FormattedAccount[] => {
  const overviews = accountOverviews.entities.reduce((prev, next) => {
    prev[next.address] = next
    return prev
  }, {} as Record<string, EntityOverviewResponseEntityItem>)

  return accounts.map(({ address, label }) => {
    const isDApp = hasDAppDefinitionMetadata(overviews[address])
    return {
      label: `${label}${isDApp ? ' - dApp definition' : ''}`,
      address,
      dappDefinition: isDApp,
      name: overviews[address]?.metadata.items.find(
        (item) => item.key === 'name'
      )?.value,
      description: overviews[address]?.metadata.items.find(
        (item) => item.key === 'description'
      )?.value,
      domain: overviews[address]?.metadata.items.find(
        (item) => item.key === 'domain'
      )?.value
    }
  })
}
