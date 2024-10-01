import { createSystemMetadata } from '@api/utils/metadata'
import type { Resource, standardMetadata } from '..'
import type { StateEntityDetailsResponseItem } from '@common/gateway-sdk'

export const systemMetadata = createSystemMetadata({
  name: 'String',
  description: 'String',
  tags: 'StringArray',
  icon_url: 'Url'
})

export type PackageOwnerBadgeCollection = Resource<
  'non-fungible',
  typeof standardMetadata & typeof systemMetadata
> & {
  nonFungibleType: 'package-owner-badge-collection'
}

export const isPackageOwnerBadgeCollection = (
  entity: StateEntityDetailsResponseItem
) =>
  entity.details?.type === 'NonFungibleResource' &&
  entity.details.native_resource_details?.kind === 'PackageOwnerBadge'
