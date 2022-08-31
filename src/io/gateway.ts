import z, { record, number, string, object, boolean, array, any } from 'zod'

export const StakesIO = object({
  pending_stakes: array(
    object({
      validator_identifier: string(),
      value: string()
    })
  ),
  stakes: array(
    object({
      validator_identifier: string(),
      value: string()
    })
  )
})

export const StakesTransformedIO = object({
  pendingStakes: record(string(), number()),
  stakes: record(string(), number())
})

export const ValidatorIO = object({
  validator_identifier: object({
    address: string()
  }),
  stake: object({
    value: string(),
    token_identifier: object({
      rri: string()
    })
  }),
  info: object({
    owner_stake: object({
      value: string(),
      token_identifier: object({
        rri: string()
      })
    }),
    uptime: object({
      epoch_range: object({
        from: number(),
        to: number()
      }),
      uptime_percentage: number(),
      proposals_missed: number(),
      proposals_completed: number()
    })
  }),
  properties: object({
    url: string(),
    validator_fee_percentage: number(),
    name: string(),
    registered: boolean(),
    owner_account_identifier: object({
      address: string()
    }),
    external_stake_accepted: boolean()
  }),
  latest_fork_readiness_signal: object({
    signalled_at: object({
      version: number(),
      timestamp: string(),
      epoch: number(),
      round: number()
    }),
    fork_id: string(),
    fork_name: string()
  }).optional()
})

export const ValidatorTransformedIO = object({
  address: string(),
  name: string(),
  totalStake: number(),
  ownerStake: number(),
  uptimePercentage: number(),
  feePercentage: number(),
  stakePercentage: number(),
  ownerStakePercentage: any(), // fix: some values are NaN
  stakeAccepted: boolean()
})

export const ValidatorArrayIO = object({ validators: array(ValidatorIO) })
export const ValidatorTransformedArrayIO = array(ValidatorTransformedIO)

export type StakesTransformed = z.infer<typeof StakesTransformedIO>
export type Validator = z.infer<typeof ValidatorIO>
export type Validators = z.infer<typeof ValidatorArrayIO>
export type ValidatorTransformed = z.infer<typeof ValidatorTransformedIO>
export type ValidatorTransformedArray = z.infer<
  typeof ValidatorTransformedArrayIO
>
