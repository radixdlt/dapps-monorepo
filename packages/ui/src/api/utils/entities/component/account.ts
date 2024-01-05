import { pipe } from 'ramda'
import type { _Entity } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { transformComponent, type Component, type standardMetadata } from '.'
import { createSystemMetadata } from '@api/utils/metadata'

type ComponentState = {
  default_deposit_rule: 'Accept' | 'Reject' | 'AllowExisting'
}

const systemMetadata = createSystemMetadata({
  owner_badge: 'NonFungibleGlobalId'
})

export type Account = Component<
  ComponentState,
  typeof standardMetadata & typeof systemMetadata
> & {
  componentType: 'account'
}

export const transformAccount = (
  entity: StateEntityDetailsVaultResponseItem
): Account =>
  pipe(
    () =>
      transformComponent<
        ComponentState,
        typeof standardMetadata & typeof systemMetadata
      >(entity, systemMetadata),
    (entity) => ({
      ...entity,
      componentType: 'account' as const
    })
  )()
