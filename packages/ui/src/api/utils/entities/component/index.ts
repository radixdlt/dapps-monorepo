import BigNumber from 'bignumber.js'
import { transformEntity, type _Entity } from '..'
import type {
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import { pipe } from 'ramda'
import type { MetadataTypeToNativeType } from '../../metadata'

export type EntityType =
  | 'GlobalPackage'
  | 'GlobalConsensusManager'
  | 'GlobalValidator'
  | 'GlobalGenericComponent'
  | 'GlobalAccount'
  | 'GlobalIdentity'
  | 'GlobalAccessController'
  | 'GlobalVirtualSecp256k1Account'
  | 'GlobalVirtualSecp256k1Identity'
  | 'GlobalVirtualEd25519Account'
  | 'GlobalVirtualEd25519Identity'
  | 'GlobalFungibleResource'
  | 'InternalFungibleVault'
  | 'GlobalNonFungibleResource'
  | 'InternalNonFungibleVault'
  | 'InternalGenericComponent'
  | 'InternalKeyValueStore'
  | 'GlobalOneResourcePool'
  | 'GlobalTwoResourcePool'
  | 'GlobalMultiResourcePool'
  | 'GlobalTransactionTracker'

export type StandardMetadata = {
  name: MetadataTypeToNativeType['String'] | undefined
  description: MetadataTypeToNativeType['String'] | undefined
  tags: MetadataTypeToNativeType['StringArray'] | undefined
}

export type Component<
  ComponentState = {},
  Metadata extends StandardMetadata = StandardMetadata
> = _Entity<'component', Metadata> & {
  packageAddress: string
  blueprintName: string
  royalty: BigNumber
  state: ComponentState
}

export const transformComponent = <
  ComponentState = {},
  ExpectedMetadata extends StandardMetadata = StandardMetadata
>(
  entity: StateEntityDetailsVaultResponseItem,
  metadata: (keyof ExpectedMetadata)[] = []
): Component<ComponentState, ExpectedMetadata> =>
  pipe(
    () =>
      transformEntity<
        StateEntityDetailsResponseComponentDetails,
        ExpectedMetadata
      >(['name', 'description', 'tags', ...metadata])(entity),
    (entity) => ({
      ...entity,
      type: 'component' as const,
      packageAddress: (
        entity.details as StateEntityDetailsResponseComponentDetails
      ).package_address!,
      blueprintName: (
        entity.details as StateEntityDetailsResponseComponentDetails
      ).blueprint_name!,
      royalty: new BigNumber(0),
      state: entity.details.state as ComponentState
    })
  )()
