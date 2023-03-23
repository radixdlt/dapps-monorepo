import { getMetadata } from '@api/utils/resources'
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
      name: getMetadata('name')(metadata),
      description: getMetadata('description')(metadata),
      domain: getMetadata('domain')(metadata)
    }
  })
}
