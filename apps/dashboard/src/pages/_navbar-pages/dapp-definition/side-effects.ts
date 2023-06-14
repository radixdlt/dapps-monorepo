import {
  getStringMetadata,
  getAccountData,
  getVectorMetadata,
  type DecoratedAccount
} from '@api/utils/resources'
import type { Account } from '@stores'

export type FormattedAccount = Awaited<
  ReturnType<typeof getFormattedAccounts>
>[number]

const hasDAppDefinitionMetadata = (account: DecoratedAccount) =>
  account.details.metadata.items.some(
    (item) =>
      item.key === 'account_type' && item.value.as_string === 'dapp definition'
  )

export const getFormattedAccounts = async (accounts: Account[]) => {
  const decoratedAccounts = await getAccountData(
    accounts.map((acc) => acc.address)
  )

  const getAccount = (address: string) =>
    decoratedAccounts.find((acc) => acc.accountAddress === address)!

  return Promise.all(
    accounts.map(async ({ address, label }) => {
      const account = getAccount(address)
      const isDApp = hasDAppDefinitionMetadata(account)
      const metadata = account.details.metadata

      return {
        label: `${label}${isDApp ? ' - dApp definition' : ''}`,
        address,
        dappDefinition: isDApp,
        resources: {
          fungible: account.fungible,
          nonFungible: account.nonFungible
        },
        name: getStringMetadata('name')(metadata),
        description: getStringMetadata('description')(metadata),
        domain: getStringMetadata('domain')(metadata),
        claimedWebsites: getVectorMetadata('claimed_websites')(metadata),
        claimedEntities: getVectorMetadata('claimed_entities')(metadata)
      }
    })
  )
}
