import { getAuthInfo, type AuthInfo } from '../../../utils/auth'
import {
  transformMetadata,
  type KnownStandardTypes,
  type MetadataTypeToNativeType
} from '../metadata'
import type { Resource } from './resource'
import type { Validator } from './validator'
import type {
  EntityMetadataItem,
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'

export type Entity = Validator | Resource

export type _Entity<
  Type extends string,
  StandardMetadata extends (keyof KnownStandardTypes)[],
  HasAuth = true
> = {
  type: Type
  address: string
  metadata: {
    standard: Partial<
      {
        [K in StandardMetadata[number]]: {
          item: EntityMetadataItem
          value: MetadataTypeToNativeType[KnownStandardTypes[K]]
        }
      } & {
        tags: {
          item: EntityMetadataItem
          value: MetadataTypeToNativeType[KnownStandardTypes['tags']]
        }
      }
    >
    nonStandard: EntityMetadataItem[]
    explicit: EntityMetadataItem[]
    all: EntityMetadataItem[]
  }
} & (HasAuth extends true ? { auth: AuthInfo } : {})

export const transformEntity =
  (standardMetadata: (keyof KnownStandardTypes)[]) =>
  <
    E extends {
      address: string
      metadata: StateEntityDetailsVaultResponseItem['metadata']
      details?: StateEntityDetailsVaultResponseItem['details']
    }
  >(
    entity: E
  ) => ({
    address: entity.address,
    entity,
    metadata: transformMetadata(entity, standardMetadata),
    auth: (entity.details as StateEntityDetailsResponseComponentDetails)
      .role_assignments
      ? getAuthInfo(
          (entity.details as StateEntityDetailsResponseComponentDetails)
            .role_assignments!
        )
      : (undefined as unknown as AuthInfo)
  })
