import {
  callApi,
  getEntityDetails,
  getEntityNonFungibleIDs,
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
} from '@common/gateway-sdk'
import { andThen, flatten, isNil, map, pick, pipe, reject } from 'ramda'
import { BigNumber } from 'bignumber.js'
import { getNonFungibleData } from '@api/gateway'
import { transformMetadata } from '../metadata'
import type { _Entity } from '.'
import { transformNft, type _NonFungible, type NonFungible } from '../nfts'
import { isPoolUnit, resourceToPoolUnit } from './pool-unit'
import { getAuthInfo, type AuthInfo, isAllowed } from '../auth'

type _Resource<T extends 'fungible' | 'non-fungible'> = _Entity<
  'resource',
  ['name', 'symbol', 'icon_url', 'description', 'tags']
> & {
  resourceType: T
  totalSupply: string
  divisibility: number
  metadata: {
    explicit: EntityMetadataItem[]
  }
  behaviors: 'simple' | Behavior[]
}

export type FungibleResource = _Resource<'fungible'> & {
  value: string
}

export type NonFungibleResource = _Resource<'non-fungible'>

export type Resource = FungibleResource | NonFungibleResource

export type DecoratedAccount = Awaited<
  ReturnType<typeof getAccountData>
>[number]

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

type RoleKey =
  | 'burner'
  | 'minter'
  | 'freezer'
  | 'recaller'
  | 'depositer'
  | 'withdrawer'
  | 'non_fungible_data_updater'
  | 'burner_updater'
  | 'minter_updater'
  | 'freezer_updater'
  | 'recaller_updater'
  | 'depositer_updater'
  | 'withdrawer_updater'

type Behavior =
  | 'simple'
  | 'supply-increase'
  | 'supply-decrease'
  | 'supply-increase-decrease'
  | 'supply-increase-anyone'
  | 'supply-decrease-anyone'
  | 'supply-increase-decrease-anyone'
  | 'movement-restricted'
  | 'movement-restricted-future'
  | 'movement-restricted-future-anyone'
  | 'freezable'
  | 'freezable-anyone'
  | 'info-can-change'
  | 'info-can-change-anyone'
  | 'removable-by-third-party'
  | 'removable-by-anyone'
  | 'nft-data-changeable'
  | 'nft-data-changeable-anyone'

const ruleToBehavior =
  (authInfo: AuthInfo) =>
  (
    rule: AuthInfo['rules'][keyof AuthInfo['rules']],
    roleKey: RoleKey
  ): Behavior | undefined => {
    const allowed = isAllowed(authInfo)(rule)

    if (allowed === 'by-someone') {
      switch (roleKey) {
        case 'burner':
        case 'burner_updater': {
          return 'supply-decrease'
        }
        case 'minter':
        case 'minter_updater': {
          return 'supply-increase'
        }
        case 'recaller':
        case 'recaller_updater': {
          return 'removable-by-third-party'
        }
        case 'freezer':
        case 'freezer_updater': {
          return 'freezable'
        }
        case 'non_fungible_data_updater': {
          return 'nft-data-changeable'
        }
        case 'depositer_updater':
        case 'withdrawer_updater': {
          return 'movement-restricted-future'
        }
      }
    }

    if (allowed === 'by-anyone') {
      switch (roleKey as RoleKey) {
        case 'burner':
        case 'burner_updater': {
          return 'supply-decrease-anyone'
        }
        case 'minter':
        case 'minter_updater': {
          return 'supply-increase-anyone'
        }
        case 'recaller':
        case 'recaller_updater': {
          return 'removable-by-anyone'
        }
        case 'freezer':
        case 'freezer_updater': {
          return 'freezable-anyone'
        }
        case 'non_fungible_data_updater': {
          return 'nft-data-changeable-anyone'
        }
        case 'depositer_updater':
        case 'withdrawer_updater': {
          return 'movement-restricted-future-anyone'
        }
      }
    }

    if (allowed === 'by-no-one') {
      switch (roleKey as RoleKey) {
        case 'depositer':
        case 'withdrawer': {
          return 'movement-restricted'
        }
      }
    }
  }

const getCombinedBehaviors = (behaviors: Behavior[]) => {
  if (behaviors.length === 0) return 'simple'

  let _behaviors = [...behaviors]

  const removeItem = (item: Behavior) => {
    _behaviors = _behaviors.filter((behavior) => behavior !== item)
  }

  if (
    behaviors.includes('supply-increase') &&
    behaviors.includes('supply-decrease')
  ) {
    removeItem('supply-increase')
    removeItem('supply-decrease')
    _behaviors.push('supply-increase-decrease')
  }

  if (
    behaviors.includes('supply-increase-anyone') &&
    behaviors.includes('supply-decrease-anyone')
  ) {
    removeItem('supply-increase-anyone')
    removeItem('supply-decrease-anyone')
    _behaviors.push('supply-increase-decrease-anyone')
  }

  if (
    behaviors.includes('supply-increase') &&
    behaviors.includes('supply-increase-anyone')
  ) {
    removeItem('supply-increase')
  }

  if (
    behaviors.includes('supply-decrease') &&
    behaviors.includes('supply-decrease-anyone')
  ) {
    removeItem('supply-decrease')
  }

  if (
    behaviors.includes('supply-increase-decrease') &&
    behaviors.includes('supply-increase-decrease-anyone')
  ) {
    removeItem('supply-increase-decrease')
  }

  if (
    behaviors.includes('movement-restricted') &&
    behaviors.includes('movement-restricted-future')
  ) {
    removeItem('movement-restricted-future')
  }

  if (
    behaviors.includes('movement-restricted-future') &&
    behaviors.includes('movement-restricted-future-anyone')
  ) {
    removeItem('movement-restricted-future')
  }

  if (
    behaviors.includes('removable-by-third-party') &&
    behaviors.includes('removable-by-anyone')
  ) {
    removeItem('removable-by-third-party')
  }

  if (
    behaviors.includes('freezable') &&
    behaviors.includes('freezable-anyone')
  ) {
    removeItem('freezable')
  }

  if (
    behaviors.includes('nft-data-changeable') &&
    behaviors.includes('nft-data-changeable-anyone')
  ) {
    removeItem('nft-data-changeable')
  }

  return _behaviors
}

export const getBehaviors = (auth: AuthInfo) =>
  pipe(
    () => Object.entries(auth.rules),
    map(([roleKey, rule]) => ruleToBehavior(auth)(rule, roleKey as RoleKey)),
    (behaviors) => reject(isNil, behaviors),
    (behaviors) =>
      behaviors.filter(
        (behavior, index) => behaviors.indexOf(behavior) === index,
        behaviors
      ),
    getCombinedBehaviors
  )()

export const transformNonFungibleResource = (
  entity: StateEntityDetailsResponseItem
): NonFungibleResource =>
  ({
    type: 'resource',
    resourceType: 'non-fungible',
    address: `${entity.address}`,
    totalSupply: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).total_supply,
    divisibility: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).divisibility,
    metadata: transformMetadata(entity, [
      'name',
      'symbol',
      'icon_url',
      'description',
      'tags'
    ]),
    behaviors: getBehaviors(
      getAuthInfo(
        (entity.details as StateEntityDetailsResponseFungibleResourceDetails)
          .role_assignments
      )
    )
  } as const)

export const transformFungibleResource = (
  entity: StateEntityDetailsResponseItem,
  fungible?: FungibleResourcesCollectionItemVaultAggregated
): FungibleResource =>
  ({
    type: 'resource',
    resourceType: 'fungible',
    value:
      fungible?.vaults.items
        .reduce((prev, next) => prev.plus(next.amount), new BigNumber(0))
        .toString() || '0',
    address: entity.address,
    totalSupply: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).total_supply,
    divisibility: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).divisibility,
    metadata: transformMetadata(entity, [
      'name',
      'symbol',
      'icon_url',
      'description',
      'tags'
    ]),
    behaviors: getBehaviors(
      getAuthInfo(
        (entity.details as StateEntityDetailsResponseFungibleResourceDetails)
          .role_assignments
      )
    )
  } as const)

export type TransformedNonFungible = {
  resource: NonFungibleResource
  ownedNonFungibles: number
  nonFungibles: (NonFungible | NonFungible['id'])[]
  nextCursor?: string
  vaultAddress: string
}

const transformNonFungible = async (
  accountResourceItems: {
    account: string
    items: NonFungibleResourcesVaultCollection['items']
  }[],
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector,
  getNonFungiblesForResources?: string[]
) => {
  if (accountResourceItems.length === 0) {
    return []
  }

  const allNonFungibleAddresses = pipe(
    () => accountResourceItems,
    map(({ items }) => items),
    flatten,
    map(({ resource_address }) => resource_address)
  )()

  const nonFungibleEntities = await getEntityDetails(
    allNonFungibleAddresses,
    stateOptions,
    ledgerState
  )

  return Promise.all(
    accountResourceItems.map(async ({ account, items }) => ({
      account,
      items: await Promise.all(
        items.map(async (item) => {
          const ids = pipe(
            () => item.vaults.items,
            map(({ items }) => items),
            (items) => reject(isNil, items),
            flatten
          )()

          const entity = nonFungibleEntities.find(
            ({ address }) => address === item.resource_address
          )!

          let nftData: StateNonFungibleDetailsResponseItem[] = []

          const transformedNonFungible: TransformedNonFungible = {
            ownedNonFungibles: item.vaults.items.reduce((sum, vault) => {
              return sum + vault.total_count
            }, 0),
            resource: transformNonFungibleResource(entity),
            nonFungibles: [],
            nextCursor: item.vaults.items[0].next_cursor || undefined,
            vaultAddress: item.vaults.items[0].vault_address
          }

          if (
            !getNonFungiblesForResources ||
            (getNonFungiblesForResources &&
              getNonFungiblesForResources.includes(item.resource_address))
          ) {
            nftData = await getNonFungibleData(item.resource_address, ids)

            for (const singleNftData of nftData) {
              transformedNonFungible.nonFungibles.push(
                transformNft(item.resource_address, singleNftData)
              )
            }
          } else {
            transformedNonFungible.nonFungibles = ids
          }
          return transformedNonFungible
        })
      )
    }))
  )
}

export const transformFungible = async (
  accountResourceItems: {
    account: string
    items: FungibleResourcesVaultCollection['items']
  }[],
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
): Promise<
  {
    account: string
    items: FungibleResource[]
  }[]
> => {
  if (accountResourceItems.length === 0) {
    return []
  }

  const allFungibleAddresses = pipe(
    () => accountResourceItems,
    map(({ items }) => items),
    flatten,
    map(({ resource_address }) => resource_address)
  )()

  const fungibleEntities = await getEntityDetails(
    allFungibleAddresses,
    stateOptions,
    ledgerState
  )

  return accountResourceItems.map((item) => ({
    account: item.account,
    items: item.items.map((fungible) => {
      const entity = fungibleEntities.find(
        ({ address }) => address === fungible.resource_address
      )!

      return transformFungibleResource(entity, fungible)
    })
  }))
}

export const transformResource = (entity: StateEntityDetailsResponseItem) => {
  if (entity.details?.type === 'FungibleResource') {
    const fungible = transformFungibleResource(entity)
    if (isPoolUnit(fungible)) {
      return resourceToPoolUnit(fungible)
    }
    return fungible
  }

  return transformNonFungibleResource(entity)
}

export const transformResources =
  (
    stateOptions?: StateEntityDetailsOptions,
    ledgerState?: LedgerStateSelector,
    getNonFungiblesForResources?: string[]
  ) =>
  async (
    accountEntities: StateEntityDetailsVaultResponseItem[],
    options?: Partial<{ fungibles: boolean; nfts: boolean }>
  ) => {
    const { fungibles = true, nfts = true } = options || {}

    const resources = accountEntities.map(
      pick(['address', 'fungible_resources', 'non_fungible_resources'])
    )

    const fungibleItems = resources.map(
      ({ address, fungible_resources: { items } }) => ({
        account: address,
        items
      })
    )

    const nonFungibleItems = resources.map(
      ({ address, non_fungible_resources: { items } }) => ({
        account: address,
        items
      })
    )

    const fungible = fungibles
      ? await transformFungible(fungibleItems, stateOptions, ledgerState)
      : []

    const nonFungible = nfts
      ? await transformNonFungible(
          nonFungibleItems,
          stateOptions,
          ledgerState,
          getNonFungiblesForResources
        )
      : []

    return accountEntities.map((accountEntity) => ({
      accountAddress: accountEntity.address,
      details: accountEntity,
      fungible: fungible.find(
        ({ account }) => account === accountEntity.address
      )!.items,
      nonFungible: nonFungible.find(
        ({ account }) => account === accountEntity.address
      )!.items
    }))
  }

const getResource =
  <T extends 'fungible' | 'nonFungible'>(type: T) =>
  (name: string) =>
  (
    resources: Omit<Resources[number], 'details' | 'accountAddress'>
  ): T extends 'fungible' ? FungibleResource : NonFungibleResource =>
    // @ts-ignore
    resources[type].find((resource: Resource) => resource.name === name)

export type Resources = Awaited<ReturnType<typeof getAccountData>>

export const getFungibleResource = getResource('fungible')
export const getNonFungibleResource = getResource('nonFungible')

export const getAccountData = (
  accounts: string[],
  options?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector,
  getNonFungiblesForResources?: string[]
) =>
  pipe(
    () => getEntityDetails(accounts, options, ledgerState),
    andThen(
      transformResources(options, ledgerState, getNonFungiblesForResources)
    )
  )()

export const getAccountFungibleTokens = (accounts: string) =>
  pipe(
    () => getSingleEntityDetails(accounts),
    andThen((data) =>
      transformResources()([data], { nfts: false, fungibles: true })
    ),
    andThen((data) => data[0])
  )()

export const getAccountDataNew = (
  accounts: string[],
  options?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector,
  getNonFungiblesForResources?: string[]
) =>
  pipe(
    () =>
      callApi(
        'getEntityDetailsVaultAggregated',
        accounts,
        options,
        ledgerState
      ),
    (result) =>
      result.map(
        transformResources(options, ledgerState, getNonFungiblesForResources)
      )
  )()
