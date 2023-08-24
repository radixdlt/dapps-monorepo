import {
  getEntityDetails,
  getEntityNonFungibleIDs,
  getNonFungibleIDs,
  getSingleEntityDetails
} from '@api/gateway'
import type {
  EntityMetadataCollection,
  FungibleResourcesVaultCollection,
  LedgerStateSelector,
  NonFungibleResourcesCollectionItemVaultAggregated,
  NonFungibleResourcesVaultCollection,
  StateEntityDetailsOptions,
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
  name?: string
  symbol?: string
  iconUrl?: string
  description?: string
  tags?: string[]
  totalSupply: string
  explicitMetadata?: EntityMetadataCollection
}

export type FungibleResource = _Resource<'fungible'> & {
  value: string
}

export type NonFungibleResource = _Resource<'non-fungible'>

export type NonFungibleAddress<
  R extends string = string,
  I extends string = string
> = {
  resourceAddress: R
  id: I
  nonFungibleAddress: `${R}:${I}`
}

export type NonFungible = {
  address: NonFungibleAddress
  id: string
  unstakeData: {
    claimEpoch: string
    unstakeAmount: string
  }
  nonFungibleResource: NonFungibleResourcesCollectionItemVaultAggregated
  name?: string
  iconUrl?: string
  description?: string
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

const nonFungibleDisplayLabel = (
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
    (
      metadata?.items.find((item) => item.key === key)?.value
        ?.programmatic_json as any
    )?.fields?.[0].value || ''

export const getStringMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    (metadata?.items.find((item) => item.key === key)?.value?.typed as any)
      ?.value || ''

export const getVectorMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    (metadata?.items.find((item) => item.key === key)?.value.typed as any)
      ?.values || []

export const getUnstakeData = (
  nftData: StateNonFungibleDetailsResponseItem
) => {
  const { claimEpoch, unstakeAmount } = (
    nftData.data?.programmatic_json as {
      fields: { kind: string; value: string }[]
    }
  ).fields.reduce(
    (acc, curr) =>
      curr.kind === 'U64'
        ? { ...acc, claimEpoch: curr.value }
        : curr.kind === 'Decimal'
        ? { ...acc, unstakeAmount: curr.value }
        : acc,
    { claimEpoch: '', unstakeAmount: '' }
  )
  return {
    claimEpoch,
    unstakeAmount
  }
}

const getNftData = (
  nftData: StateNonFungibleDetailsResponseItem,
  key: string
) =>
  ((nftData.data?.programmatic_json as any).fields as any[]).find(
    ({ field_name }) => field_name === key
  )?.value

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
  accountAddress: string,
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
) => {
  if (nonFungibles.items.length === 0) {
    return []
  }

  const transformedNonFungibles: {
    resource: NonFungibleResource
    totalNonFungibles: number
    nonFungibles: NonFungible[]
  }[] = []

  const nonFungibleEntities = await getEntityDetails(
    nonFungibles.items.map(({ resource_address }) => resource_address),
    stateOptions,
    ledgerState
  )

  for (const nonFungible of nonFungibles.items) {
    const ids = await getNonFungibleIds(accountAddress, nonFungible)
    const entity = nonFungibleEntities.find(
      ({ address }) => address === nonFungible.resource_address
    )!

    const nftData = await getNonFungibleData(nonFungible.resource_address, ids)

    let length = transformedNonFungibles.push({
      resource: {
        type: 'non-fungible',
        address: `${entity.address}`,
        name: getStringMetadata('name')(entity.metadata),
        totalSupply: (
          entity.details as StateEntityDetailsResponseFungibleResourceDetails
        ).total_supply,
        iconUrl: getStringMetadata('icon_url')(entity.metadata),
        tags: getVectorMetadata('tags')(entity.metadata),
        explicitMetadata: entity.explicit_metadata
      },
      totalNonFungibles: (await getNonFungibleIDs(nonFungible.resource_address))
        .length,
      nonFungibles: []
    })

    for (const singleNftData of nftData) {
      transformedNonFungibles[length - 1].nonFungibles.push({
        address: {
          resourceAddress: nonFungible.resource_address,
          id: singleNftData.non_fungible_id,
          nonFungibleAddress: `${entity.address}:${singleNftData.non_fungible_id}`
        },
        id: singleNftData.non_fungible_id,
        unstakeData: getUnstakeData(singleNftData) ?? [],
        nonFungibleResource: nonFungible,
        name: getNftData(singleNftData, 'name'),
        description: getNftData(singleNftData, 'description'),
        iconUrl: getNftData(singleNftData, 'key_image_url')
      })
    }
  }

  return transformedNonFungibles
}

export const transformFungible = async (
  fungibles: FungibleResourcesVaultCollection,
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
): Promise<FungibleResource[]> => {
  if (fungibles.items.length === 0) {
    return []
  }

  const fungibleEntities = await getEntityDetails(
    fungibles.items.map(({ resource_address }) => resource_address),
    stateOptions,
    ledgerState
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
      ).total_supply,
      explicitMetadata: entity.explicit_metadata
    }
  })
}

export const transformResources =
  (stateOptions?: StateEntityDetailsOptions) =>
  (ledgerState?: LedgerStateSelector) =>
  (
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
          ? await transformFungible(
              fungible_resources,
              stateOptions,
              ledgerState
            )
          : []
        const nonFungible = nfts
          ? await transformNonFungible(
              non_fungible_resources,
              address,
              stateOptions
            )
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

export const getAccountData = (
  accounts: string[],
  options?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
) =>
  pipe(
    () => getEntityDetails(accounts, options, ledgerState),
    andThen(transformResources(options)(ledgerState))
  )()

export const getAccountFungibleTokens = (accounts: string) =>
  pipe(
    () => getSingleEntityDetails(accounts),
    andThen((data) =>
      transformResources()()([data], { nfts: false, fungibles: true })
    ),
    andThen((data) => data[0])
  )()
