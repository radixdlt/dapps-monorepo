import {
  getAccountData,
  type DecoratedAccount
} from '@api/utils/entities/resource'
import type { Account } from '@stores'
import type { EntityT } from './dapp-metadata/rows/linking-metadata-list/Entity.svelte'
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

export const getTxManifest = (
  address: string,
  entities: EntityT[],
  metadata: { key: string; value: unknown }[]
) => {
  let manifest = ''

  for (const entity of entities) {
    if (entity.requiredProof && entity.requiredProof !== 'AllowAll') {
      manifest += `CALL_METHOD
          Address("${address}")
          "create_proof_of_non_fungibles"
          Address("${entity.requiredProof.split(':')[0]}")
          Array<NonFungibleLocalId>(NonFungibleLocalId("${
            entity.requiredProof.split(':')[1]
          }"));`
    }
  }

  for (const { key, value } of metadata) {
    if (value === undefined) {
      manifest += `
        REMOVE_METADATA
        Address("${address}")
        "${key}";
        `
    } else {
      let manifestValue: string = ''

      if (Array.isArray(value)) {
        if (key === 'claimed_websites')
          manifestValue = `
        Enum<Metadata::OriginArray>(
          Array<String>(${value.map((v) => `"${v.url}"`).join(', ')})
        );`
        else if (key === 'claimed_entities')
          manifestValue = `
        Enum<Metadata::AddressArray>(
          Array<Address>(${value
            .map((v) => `"Address(${v.address})"`)
            .join(', ')})
        );`
      }

      if (typeof value === 'string') {
        manifestValue = `Enum<Metadata::String>("${value}");`
        try {
          new URL(value)
          manifestValue = `Enum<Metadata::Url>("${value}");`
        } catch {}
      }

      manifest += `
          SET_METADATA
            Address("${address}")
            "${key}"
            ${manifestValue}
          `
    }
  }

  for (const entity of entities) {
    manifest += `
        SET_METADATA
          Address("${entity.address}")
          "dapp_definition"
          Enum<Metadata::Address>(Address("${address}"));
      `
  }

  return manifest
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
