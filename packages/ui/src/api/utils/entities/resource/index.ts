import type {
  EntityMetadataItem,
  NativeResourceDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import { transformEntity, type _Entity } from '..'
import { pipe } from 'ramda'
import type {
  StateEntityDetailsResponseFungibleResourceDetails,
  StateEntityDetailsResponseNonFungibleResourceDetails
} from '@common/gateway-sdk'
import { getBehaviors, type Behavior } from './behaviors'
import { getAuthInfo } from '@api/utils/auth'
import { transformFungibleResource } from './fungible'
import {
  getPoolUnits,
  hasPoolMetadataSet,
  isPoolUnit,
  resourceToPoolUnit
} from './fungible/pool-unit'
import { transformNonFungibleResource } from './non-fungible'
import {
  createStandardMetadata,
  type ExpectedMetadata
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
  nativeResourceDetails?: NativeResourceDetails
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

export const transformUnknownResource = (
  entity: StateEntityDetailsVaultResponseItem
) => {
  if (entity.details?.type === 'FungibleResource') {
    const fungible = transformFungibleResource(entity)
    return isPoolUnit(fungible) ? resourceToPoolUnit(fungible) : fungible
  }

  return transformNonFungibleResource(entity)
}
