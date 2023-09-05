import {
  getEntityDetails,
  getEntityNonFungibleIDs,
  getNonFungibleIDs,
  getSingleEntityDetails
} from '@api/gateway'
import type {
  EntityMetadataItem,
  FungibleResourcesCollectionItemVaultAggregated,
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
import { andThen, pipe } from 'ramda'
import { BigNumber } from 'bignumber.js'
import { getNonFungibleData } from '@api/gateway'
import {
  getStandardMetadataEntry,
  getStringMetadata,
  getVectorMetadata
} from './metadata'
import type { _Entity } from './entity'

type _Resource<T extends 'fungible' | 'non-fungible'> = _Entity<
  [
    ['name', string],
    ['symbol', string],
    ['iconUrl', string],
    ['description', string],
    ['tags', string[]]
  ]
> & {
  type: T
  totalSupply: string
  metadata: {
    explicit: EntityMetadataItem[]
  }
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
  nftData: {
    standard: {
      unstakeData?: {
        claimEpoch: string
        unstakeAmount: string
      }
      name?: string
      iconUrl?: string
      description?: string
    }
    nonStandard: any[]
  }
}

export type Resource = FungibleResource | NonFungibleResource

export type DecoratedAccount = Awaited<
  ReturnType<typeof getAccountData>
>[number]

export const getUnstakeData = (
  data: StateNonFungibleDetailsResponseItem['data']
) => {
  const { claimEpoch, unstakeAmount } = (
    data?.programmatic_json as {
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
  data: StateNonFungibleDetailsResponseItem['data'],
  key: string
) =>
  ((data?.programmatic_json as any).fields as any[]).find(
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

export const transformNft = (
  resource_address: NonFungibleResourcesCollectionItemVaultAggregated['resource_address'],
  { non_fungible_id, data }: StateNonFungibleDetailsResponseItem
): NonFungible =>
  ({
    address: {
      resourceAddress: resource_address,
      id: non_fungible_id,
      nonFungibleAddress: `${resource_address}:${non_fungible_id}`
    },
    id: non_fungible_id,
    nftData: {
      standard: {
        unstakeData: getUnstakeData(data) ?? [],
        name: getNftData(data, 'name'),
        description: getNftData(data, 'description'),
        iconUrl: getNftData(data, 'key_image_url')
      },
      nonStandard: ((data?.programmatic_json as any).fields as any[]).filter(
        ({ field_name }) =>
          field_name !== 'name' &&
          field_name !== 'description' &&
          field_name !== 'key_image_url'
      )
    }
  } as const)

export const transformNonFungibleResource = (
  entity: StateEntityDetailsVaultResponseItem
): NonFungibleResource =>
  ({
    type: 'non-fungible',
    address: `${entity.address}`,
    totalSupply: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).total_supply,
    metadata: {
      standard: {
        name: getStandardMetadataEntry(
          'name',
          getStringMetadata
        )(entity.metadata),
        description: getStandardMetadataEntry(
          'description',
          getStringMetadata
        )(entity.metadata),
        iconUrl: getStandardMetadataEntry(
          'icon_url',
          getStringMetadata
        )(entity.metadata),
        tags: getStandardMetadataEntry(
          'tags',
          getVectorMetadata
        )(entity.metadata)
      },
      nonStandard: (entity.metadata?.items || []).filter(
        ({ key }) =>
          key !== 'name' &&
          key !== 'icon_url' &&
          key !== 'tags' &&
          key !== 'description'
      ),
      explicit: entity.explicit_metadata?.items ?? [],
      all: entity.metadata?.items ?? []
    }
  } as const)

export const transformFungibleResource = (
  entity: StateEntityDetailsResponseItem,
  fungible?: FungibleResourcesCollectionItemVaultAggregated
): FungibleResource =>
  ({
    type: 'fungible',
    value:
      fungible?.vaults.items
        .reduce((prev, next) => prev.plus(next.amount), new BigNumber(0))
        .toString() || '0',
    address: entity.address,
    totalSupply: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).total_supply,
    metadata: {
      standard: {
        name: getStandardMetadataEntry(
          'name',
          getStringMetadata
        )(entity.metadata),
        symbol: getStandardMetadataEntry(
          'symbol',
          getStringMetadata
        )(entity.metadata),
        iconUrl: getStandardMetadataEntry(
          'icon_url',
          getStringMetadata
        )(entity.metadata),
        description: getStandardMetadataEntry(
          'description',
          getStringMetadata
        )(entity.metadata),
        tags: getStandardMetadataEntry(
          'tags',
          getVectorMetadata
        )(entity.metadata)
      },
      nonStandard: ((entity.metadata?.items as any[]) || []).filter(
        ({ key }) =>
          key !== 'name' &&
          key !== 'symbol' &&
          key !== 'icon_url' &&
          key !== 'description' &&
          key !== 'tags'
      ),
      explicit: entity.explicit_metadata?.items ?? [],
      all: entity.metadata?.items ?? []
    }
  } as const)

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
      resource: transformNonFungibleResource(entity),
      totalNonFungibles: (await getNonFungibleIDs(nonFungible.resource_address))
        .length,
      nonFungibles: []
    })

    for (const singleNftData of nftData) {
      transformedNonFungibles[length - 1].nonFungibles.push(
        transformNft(nonFungible.resource_address, singleNftData)
      )
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
    const fungible = fungibles.items.find(
      ({ resource_address }) => resource_address === entity.address
    )!

    return transformFungibleResource(entity, fungible)
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
