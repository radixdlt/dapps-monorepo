import {
  getEntityDetails,
  getEntityNonFungibleIDs,
  getSingleEntityDetails
} from '@api/gateway'
import type {
  EntityMetadataCollection,
  FungibleResourcesVaultCollection,
  NonFungibleResourcesCollectionItemVaultAggregated,
  NonFungibleResourcesVaultCollection,
  StateEntityDetailsResponseFungibleResourceDetails,
  StateEntityDetailsResponseItem,
  StateEntityDetailsVaultResponseItem,
  StateNonFungibleDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { accountLabel, getNFTAddress } from '@utils'
import { andThen, pipe } from 'ramda'
import { BigNumber } from 'bignumber.js'
import { getNonFungibleData } from '@api/gateway'

type _Resource<T extends 'fungible' | 'non-fungible'> = {
  type: T
  address: string
  label: string
  name?: string
  symbol?: string
  iconUrl?: string
  description?: string
  tags?: string[]
  totalSupply: string
}

export type FungibleResource = _Resource<'fungible'> & {
  value: string
}

export type NonFungibleResource = _Resource<'non-fungible'> & {
  id: string
  unstakeData: {
    claimEpoch: string
    unstakeAmount: string
  }
}

export type Resource = FungibleResource | NonFungibleResource

export type DecoratedAccount = Awaited<
  ReturnType<typeof getAccountData>
>[number]

const fungibleResourceDisplayLabel = (
  resource: StateEntityDetailsResponseItem
) =>
  pipe(
    () => [
      getStringMetadata('symbol')(resource.metadata),
      getStringMetadata('name')(resource.metadata)
    ],
    ([symbol, name]) =>
      symbol && name
        ? `${name} (${symbol})`
        : symbol || name || resource.address
  )()

const nonFungibleResourceDisplayLabel = (
  resource: StateEntityDetailsResponseItem,
  id: string
) =>
  pipe(
    () => getStringMetadata('name')(resource.metadata),
    (name) =>
      name
        ? `${accountLabel({
            address: getNFTAddress(resource.address, id),
            label: name || ''
          })}`
        : `${getNFTAddress(resource.address, id)}`
  )()

export const getEnumStringMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    (metadata?.items.find((item) => item.key === key)?.value?.raw_json as any)
      ?.fields?.[0].value || ''

export const getStringMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    metadata?.items.find((item) => item.key === key)?.value?.as_string || ''

export const getVectorMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    metadata?.items.find((item) => item.key === key)?.value
      ?.as_string_collection || []

export const getUnstakeData = (
  nftData: StateNonFungibleDetailsResponseItem
) => ({
  // @ts-ignore
  claimEpoch: nftData.data.raw_json.fields[0].value as string,
  // @ts-ignore
  unstakeAmount: nftData.data.raw_json.fields[1].value as string
})

const getNonFungibleIds = async (
  accountAddress: string,
  nonFungibleResource: NonFungibleResourcesCollectionItemVaultAggregated
) => {
  const ids: string[] = []

  for (const vault of nonFungibleResource.vaults.items) {
    const entityIds = await getEntityNonFungibleIDs(
      accountAddress,
      nonFungibleResource.resource_address,
      vault.vault_address
    )

    ids.push(...entityIds.items)
  }

  return ids
}

const transformNonFungible = async (
  nonFungibles: NonFungibleResourcesVaultCollection,
  accountAddress: string
) => {
  if (nonFungibles.items.length === 0) {
    return []
  }

  const transformedNonFungibles: NonFungibleResource[] = []

  const nonFungibleEntities = await getEntityDetails(
    nonFungibles.items.map(({ resource_address }) => resource_address)
  )

  for (const nonFungible of nonFungibles.items) {
    const ids = await getNonFungibleIds(accountAddress, nonFungible)
    const entity = nonFungibleEntities.find(
      ({ address }) => address === nonFungible.resource_address
    )!

    const nftData = await getNonFungibleData(nonFungible.resource_address, ids)

    for (const singleNftData of nftData) {
      transformedNonFungibles.push({
        type: 'non-fungible',
        label: nonFungibleResourceDisplayLabel(
          entity,
          singleNftData.non_fungible_id
        ),
        id: singleNftData.non_fungible_id,
        address: `${entity.address}`,
        name: getStringMetadata('name')(entity.metadata),
        unstakeData: getUnstakeData(singleNftData) ?? [],
        totalSupply: (
          entity.details as StateEntityDetailsResponseFungibleResourceDetails
        ).total_supply
      })
    }
  }

  return transformedNonFungibles
}

const transformFungible = async (
  fungibles: FungibleResourcesVaultCollection
): Promise<FungibleResource[]> => {
  if (fungibles.items.length === 0) {
    return []
  }

  const fungibleEntities = await getEntityDetails(
    fungibles.items.map(({ resource_address }) => resource_address)
  )

  return fungibleEntities.map((entity) => {
    const vaults = fungibles.items.find(
      ({ resource_address }) => resource_address === entity.address
    )?.vaults

    return {
      type: 'fungible',
      label: fungibleResourceDisplayLabel(entity),
      value:
        vaults?.items
          .reduce((prev, next) => prev.plus(next.amount), new BigNumber(0))
          .toString() || '0',
      address: entity.address,
      name: getStringMetadata('name')(entity.metadata),
      symbol: getStringMetadata('symbol')(entity.metadata),
      iconUrl: getStringMetadata('icon_url')(entity.metadata),
      description: getStringMetadata('description')(entity.metadata),
      tags: getVectorMetadata('tags')(entity.metadata),
      totalSupply: (
        entity.details as StateEntityDetailsResponseFungibleResourceDetails
      ).total_supply
    }
  })
}

export const transformResources = (
  items: StateEntityDetailsVaultResponseItem[],
  options?: Partial<{ fungibles: boolean; nfts: boolean }>
) => {
  const { fungibles = true, nfts = true } = options || {}
  return Promise.all(
    items.map(async (item) => {
      const {
        non_fungible_resources = { items: [] },
        fungible_resources = { items: [] },
        address
      } = item

      const fungible = fungibles
        ? await transformFungible(fungible_resources)
        : []
      const nonFungible = nfts
        ? await transformNonFungible(non_fungible_resources, address)
        : []
      return {
        accountAddress: item.address,
        details: item,
        fungible,
        nonFungible
      }
    })
  )
}

const getResource =
  (type: 'fungible' | 'nonFungible') =>
  (name: string) =>
  (resources: Omit<Resources[number], 'details' | 'accountAddress'>) =>
    // @ts-ignore
    resources[type].find((resource: Resource) => resource.name === name)

export type Resources = Awaited<ReturnType<typeof getAccountData>>

export const getFungibleResource = getResource('fungible')
export const getNonFungibleResource = getResource('nonFungible')

export const getAccountData = (accounts: string[]) =>
  pipe(() => getEntityDetails(accounts), andThen(transformResources))()

export const getAccountFungibleTokens = (accounts: string) =>
  pipe(
    () => getSingleEntityDetails(accounts),
    andThen((data) =>
      transformResources([data], { nfts: false, fungibles: true })
    ),
    andThen((data) => data[0])
  )()
