import type {
  EntityMetadataCollection,
  EntityMetadataItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { getStringMetadata } from './metadata'

export type Validator = {
  address: string
  ownerAddress: string
  totalStakeInXRD: string
  ownerStake: string
  percentageOwnerStake: number
  apy: number
  fee: number
  uptime: number
  acceptsStake: boolean
  percentageTotalStake: number
  stakeUnitResourceAddress: string
  unstakeClaimResourceAddress: string
  totalStakeUnits: string
  metadata: {
    standard: {
      name?: string
      website?: string
    }
    nonStandard: EntityMetadataItem[]
    all: EntityMetadataItem[]
  }
}

export const ownerOfOwnerBadge = (metadata: EntityMetadataCollection) => {
  getStringMetadata('owner_badge')(metadata)
}
