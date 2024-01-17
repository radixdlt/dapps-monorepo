import BigNumber from 'bignumber.js'
import { transformEntity, type _Entity } from '..'
import type {
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/utils/gateway-sdk'
import { pipe } from 'ramda'
import { createStandardMetadata, type ExpectedMetadata } from '../../metadata'

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

export const standardMetadata = createStandardMetadata({
  name: 'String',
  description: 'String',
  tags: 'StringArray'
})

export type Component<
  ComponentState = {},
  Metadata extends ExpectedMetadata = typeof standardMetadata
> = _Entity<'component', Metadata> & {
  packageAddress: string
  blueprintName: string
  royalty: BigNumber
  state: ComponentState
}

export const transformComponent = <
  ComponentState = {},
  ExpectedMetadata extends typeof standardMetadata = typeof standardMetadata
>(
  entity: StateEntityDetailsVaultResponseItem,
  metadata: ExpectedMetadata = {} as ExpectedMetadata
): Component<ComponentState, ExpectedMetadata> =>
  pipe(
    () =>
      transformEntity<
        StateEntityDetailsResponseComponentDetails,
        typeof standardMetadata,
        never
      >({
        ...standardMetadata,
        ...metadata
      })(entity),
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
