export type Stakes = {
  pendingStakes: Record<string, number>
  stakes: Record<string, number>
}

export type Validator = {
  address: string
  name: string
  totalStake: number
  ownerStake: number
  uptimePercentage: number
  feePercentage: number
  stakePercentage: number
  ownerStakePercentage: number
  stakeAccepted: boolean
}

export type Validators = Validator[]
