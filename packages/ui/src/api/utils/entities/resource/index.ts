import type {
  EntityMetadataItem,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import { transformEntity, type _Entity, type EntityMetadata } from '..'
import { pipe } from 'ramda'
import type {
  StateEntityDetailsResponseFungibleResourceDetails,
  StateEntityDetailsResponseNonFungibleResourceDetails
} from '@common/gateway-sdk'
import { getBehaviors, type Behavior } from './behaviors'
import { getAuthInfo } from '@api/_deprecated/utils/auth'
import type { MetadataTypeToNativeType } from '@api/_deprecated/utils/metadata'

type ResourceType = 'fungible' | 'non-fungible'

export type Resource<
  T extends ResourceType,
  Metadata extends EntityMetadata
> = _Entity<'resource', Metadata> & {
  resourceType: T
  totalSupply: string
  metadata: {
    explicit: EntityMetadataItem[]
  }
  behaviors: 'simple' | Behavior[]
  displayName: string
}

export type StandardMetadata = {
  name?: MetadataTypeToNativeType['String']
  description?: MetadataTypeToNativeType['String']
  tags?: MetadataTypeToNativeType['StringArray']
  symbol?: MetadataTypeToNativeType['String']
  icon_url?: MetadataTypeToNativeType['Url']
}

export const transformResource = <ExpectedMetadata extends EntityMetadata>(
  entity: StateEntityDetailsVaultResponseItem
) =>
  pipe(
    () =>
      transformEntity<
        | StateEntityDetailsResponseFungibleResourceDetails
        | StateEntityDetailsResponseNonFungibleResourceDetails,
        ExpectedMetadata
      >(['name', 'symbol', 'icon_url', 'description', 'tags'])(entity),
    (entity) =>
      ({
        ...entity,
        type: 'resource',
        totalSupply: entity.details?.total_supply,
        displayName: entity.metadata.expected.name
          ? `${entity.metadata.expected.name.value} ${
              entity.metadata.expected.symbol
                ? `(${entity.metadata.expected.symbol.value})`
                : ''
            }`
          : '',
        behaviors: getBehaviors(getAuthInfo(entity.details.role_assignments))
      } as const)
  )()
