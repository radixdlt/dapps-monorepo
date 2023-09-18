import {
  getAccountData,
  type DecoratedAccount
} from '@api/utils/entities/resource'
import type { Account } from '@stores'
import { getStringMetadata, getVectorMetadata } from '@api/utils/metadata'

export type FormattedAccount = Awaited<
  ReturnType<typeof getFormattedAccounts>
>[number]

const hasDAppDefinitionMetadata = (account: DecoratedAccount) =>
  account.details.metadata.items.some(
    (item) =>
      item.key === 'account_type' &&
      item.value.typed?.type === 'String' &&
      item.value.typed.value === 'dapp definition'
  )

const removeMetadata = (address: string, key: string) => `
        REMOVE_METADATA
          Address("${address}")
          "${key}"
        ;
      `

const setOrRemoveMetadata = ({
  address,
  key,
  value
}:
  | {
      key: 'dAppDefinition'
      address: string
      value: boolean
    }
  | {
      key: 'name' | 'description'
      address: string
      value?: string
    }
  | {
      key: 'claimed_websites' | 'claimed_entities'
      address: string
      value: string[]
    }) => {
  switch (key) {
    case 'dAppDefinition':
      return value
        ? `
        SET_METADATA
          Address("${address}")
          "account_type"
          Enum<Metadata::String>("dapp definition")
        ;
        `
        : removeMetadata(address, key)
    case 'name':
    case 'description':
      return value
        ? `
        SET_METADATA
          Address("${address}")
          "${key}"
          Enum<Metadata::String>("${value}")
        ;
        `
        : removeMetadata(address, key)

    case 'claimed_websites':
      return value.length
        ? `
        SET_METADATA
          Address("${address}")
          "${key}"
          Enum<Metadata::OriginArray>(Array<String>(${value
            .map((item) => `"${item}"`)
            .join(', ')}))
        ;
        `
        : removeMetadata(address, key)

    case 'claimed_entities':
      return value.length
        ? `
        SET_METADATA
          Address("${address}")
          "${key}"
          Enum<Metadata::AddressArray>(Array<Address>(${value
            .map((address) => `Address("${address}")`)
            .join(', ')}))
        ;

        ${value.map(
          (entity) => `
        SET_METADATA
          Address("${entity}")
          "dapp_definitions"
          Enum<136u8>(
            Array<Address>(
              Address("${address}")
            )
          )
        ;
        `
        )}
        `
        : removeMetadata(address, key)

    default:
      throw new Error('Invalid metadata key')
  }
}

const createBadgeProof = (badgeAddresses: string[], address: string) => {
  const transactionManifest: string[] = []

  for (const badgeAddress of badgeAddresses) {
    const isNonFungible = badgeAddress.includes(':')
    const [resourceAddress, id] = badgeAddress.split(':')

    transactionManifest.push(
      isNonFungible
        ? `
        CALL_METHOD
          Address("${address}")
          "create_proof_of_non_fungibles"
          Address("${resourceAddress}")
          Array<NonFungibleLocalId>(NonFungibleLocalId("${id}"))
        ;
        `
        : `
        CALL_METHOD
          Address("${address}")
          "create_proof_of_amount"
          Address("${badgeAddress}")
          Decimal("1")
        ;
        `
    )
  }
  return transactionManifest.join(' ')
}

export const getTxManifest = ({
  isDappDefinitionAccount,
  dAppDefinitionAddress,
  name,
  description,
  claimedWebsites,
  claimedEntities,
  badges
}: {
  isDappDefinitionAccount: boolean
  dAppDefinitionAddress: string
  name: string
  description: string
  claimedWebsites: string[]
  claimedEntities: string[]
  badges: string[]
}) => {
  const transactionManifest = [
    setOrRemoveMetadata({
      address: dAppDefinitionAddress,
      key: 'dAppDefinition',
      value: isDappDefinitionAccount
    }),
    setOrRemoveMetadata({
      address: dAppDefinitionAddress,
      key: 'name',
      value: name
    }),
    setOrRemoveMetadata({
      address: dAppDefinitionAddress,
      key: 'description',
      value: description
    }),
    setOrRemoveMetadata({
      address: dAppDefinitionAddress,
      key: 'claimed_websites',
      value: claimedWebsites
    }),
    createBadgeProof(badges, dAppDefinitionAddress),
    setOrRemoveMetadata({
      address: dAppDefinitionAddress,
      key: 'claimed_entities',
      value: claimedEntities
    })
  ].join(' ')

  return transactionManifest
}

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
        claimedWebsites: getVectorMetadata('claimed_websites')(
          metadata
        ) as string[],
        claimedEntities: getVectorMetadata('claimed_entities')(
          metadata
        ) as string[]
      }
    })
  )
}
