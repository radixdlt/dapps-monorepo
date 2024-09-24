import type {
  StateEntityDetailsResponsePackageDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import {
  type BlueprintDefinition,
  type BlueprintInterface,
  ReceiverInfoReceiverEnum
} from '@common/core-sdk'
import { transformEntity, type _Entity } from '.'
import { pipe } from 'ramda'
import { createStandardMetadata } from '../metadata'

const standardMetadata = createStandardMetadata({
  name: 'String',
  description: 'String',
  tags: 'StringArray'
})

export type PackageBlueprint = {
  name: string
  methods: {
    name: string
  }[]
}

export type Package = _Entity<'package', typeof standardMetadata> & {
  blueprints: PackageBlueprint[]
}

const getSignature = (receiver: ReceiverInfoReceiverEnum | undefined) => {
  switch (receiver) {
    case ReceiverInfoReceiverEnum.SelfRef:
      return '(&self, ..)'
    case ReceiverInfoReceiverEnum.SelfRefMut:
      return '(&mut self, ..)'
    default:
      return '(..)'
  }
}

export let transformPackage: (
  entity: StateEntityDetailsVaultResponseItem
) => Package = pipe(
  transformEntity<
    StateEntityDetailsResponsePackageDetails,
    typeof standardMetadata,
    never
  >(standardMetadata),
  (entity) => ({
    ...entity,
    blueprints:
      entity.details.blueprints?.items.map((blueprint) => {
        const definition = blueprint.definition as BlueprintDefinition
        const _interface = (definition as any).interface as BlueprintInterface
        return {
          name: blueprint.name,
          methods: Object.entries(_interface.functions).map(([name, value]) => {
            return {
              name: `${name}${getSignature(value.receiver_info?.receiver)}`
            }
          })
        }
      }) || [],
    type: 'package' as const
  })
)
