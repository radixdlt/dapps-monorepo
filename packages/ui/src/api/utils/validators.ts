import type { EntityMetadataCollection } from '@radixdlt/babylon-gateway-api-sdk'
import { getStringMetadata } from './metadata'
import type { _Entity } from './entity'

export type Validator = _Entity<
  [
    ['name', string],
    ['symbol', string],
    ['iconUrl', string],
    ['description', string],
    ['tags', string[]],
    ['website', string]
  ]
> & {
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
}

export const ownerOfOwnerBadge = (metadata: EntityMetadataCollection) => {
  getStringMetadata('owner_badge')(metadata)
}
