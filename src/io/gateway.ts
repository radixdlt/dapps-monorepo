import z, { record, number, string, object, boolean, array } from 'zod'

export const StakesIO = object({
  pendingStakes: record(string(), number()),
  stakes: record(string(), number())
})

export const ValidatorIO = object({
  address: string(),
  name: string(),
  totalStake: number(),
  ownerStake: number(),
  uptimePercentage: number(),
  feePercentage: number(),
  stakePercentage: number(),
  ownerStakePercentage: number(),
  stakeAccepted: boolean()
})

export const ValidatorArrayIO = array(ValidatorIO)

export type Stakes = z.infer<typeof StakesIO>
export type Validator = z.infer<typeof ValidatorIO>
export type Validators = z.infer<typeof ValidatorArrayIO>
