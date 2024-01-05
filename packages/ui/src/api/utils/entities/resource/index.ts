import type {
  EntityMetadataItem,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import { transformEntity, type _Entity } from '..'
import { pipe } from 'ramda'
import type {
  StateEntityDetailsResponseFungibleResourceDetails,
  StateEntityDetailsResponseNonFungibleResourceDetails
} from '@common/gateway-sdk'
import { getBehaviors, type Behavior } from './behaviors'
import { getAuthInfo } from '@api/_deprecated/utils/auth'
import { transformFungibleResource } from './fungible'
import {
  getPoolUnits,
  hasPoolMetadataSet,
  type GetEntityTypesFn,
  type GetEntityDetailsFn
} from './fungible/pool-unit'
import { transformNonFungibleResource } from './non-fungible'
import {
  createStandardMetadata,
  type ExpectedMetadata,
  type SystemMetadata
} from '@api/utils/metadata'

type ResourceType = 'fungible' | 'non-fungible'

export type Resource<
  T extends ResourceType,
  Metadata extends ExpectedMetadata = typeof standardMetadata
> = _Entity<'resource', Metadata> & {
  resourceType: T
  totalSupply: string
  metadata: {
    explicit: EntityMetadataItem[]
  }
  behaviors: 'simple' | Behavior[]
  displayName: string
}

export const standardMetadata = createStandardMetadata({
  name: 'String',
  description: 'String',
  tags: 'StringArray',
  symbol: 'String',
  icon_url: 'Url'
})

export const transformResource = <Metadata extends ExpectedMetadata>(
  entity: StateEntityDetailsVaultResponseItem,
  systemMetadata: Metadata = {} as Metadata
) =>
  pipe(
    () =>
      transformEntity<
        | StateEntityDetailsResponseFungibleResourceDetails
        | StateEntityDetailsResponseNonFungibleResourceDetails,
        typeof standardMetadata,
        typeof systemMetadata
      >(
        standardMetadata,
        systemMetadata
      )(entity),
    (entity) =>
      ({
        ...entity,
        type: 'resource',
        totalSupply: entity.details?.total_supply,
        displayName: entity.metadata.expected.name
          ? `${entity.metadata.expected.name.typed.value} ${
              entity.metadata.expected.symbol
                ? `(${entity.metadata.expected.symbol.typed.value})`
                : ''
            }`
          : '',
        behaviors: getBehaviors(getAuthInfo(entity.details.role_assignments))
      } as const)
  )()

export const transformUnknownResource = async (
  entity: StateEntityDetailsVaultResponseItem,
  getEntityTypesFn: GetEntityTypesFn,
  getEntityDetailsFn: GetEntityDetailsFn
) => {
  if (entity.details?.type === 'FungibleResource') {
    const fungible = transformFungibleResource(entity)
    if (hasPoolMetadataSet(fungible)) {
      return getPoolUnits(
        [fungible],
        getEntityTypesFn,
        getEntityDetailsFn
      ).then((res) => res[0] ?? fungible)
    }
    return fungible
  }

  return transformNonFungibleResource(entity)
}
