import { pipe } from 'ramda'
import type { _Entity } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import type { MetadataTypeToNativeType } from '@api/_deprecated/utils/metadata'
import { transformComponent, type Component, type StandardMetadata } from '.'

type ComponentState = {
  default_deposit_rule: 'Accept' | 'Reject' | 'AllowExisting'
}

type SystemMetadata = {
  owner_badge: MetadataTypeToNativeType['String']
}

export type Account = Component<
  ComponentState,
  StandardMetadata & SystemMetadata
> & {
  componentType: 'account'
}

export const transformAccount = (
  entity: StateEntityDetailsVaultResponseItem
): Account =>
  pipe(
    () =>
      transformComponent<ComponentState, StandardMetadata & SystemMetadata>(
        entity,
        ['owner_badge']
      ),
    (entity) => ({
      ...entity,
      componentType: 'account' as const
    })
  )()
