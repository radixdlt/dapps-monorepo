import { withFormattedErrors } from '@queries/with-formatted-errors'
import z, {
  record,
  number,
  string,
  object,
  boolean,
  array,
  any,
  literal,
  union
} from 'zod'

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

const actionIOType = object({
  from_account: object({ address: string() }),
  to_account: object({ address: string() }),
  amount: object({ value: string() })
})

const transactionIOType = object({
  transaction: object({
    actions: array(actionIOType),
    transaction_status: object({ status: string() })
  })
})

const actionTransformedIOType = object({
  from: string(),
  to: string(),
  amount: number()
})

const transactionTransformedIOType = object({
  status: string(),
  actions: array(actionTransformedIOType)
})

const EntityType = union([
  literal('System'),
  literal('ResourceManager'),
  literal('Component'),
  literal('Package'),
  literal('Vault'),
  literal('KeyValueStore')
])

const globalEntityIdIOType = object({
  entity_type: EntityType,
  entity_address_hex: string(),
  global_address_hex: string(),
  global_address: string()
})

const transactionReceiptIOType = object({
  committed: object({
    receipt: object({
      state_updates: object({
        new_global_entities: array(globalEntityIdIOType)
      })
    })
  })
})

const validatorArrayIOType = object({ validators: array(ValidatorIO) })

export const GlobalEntityIdIO = withFormattedErrors(globalEntityIdIOType)
export const TransactionReceiptIO = withFormattedErrors(
  transactionReceiptIOType
)
export const ValidatorArrayIO = withFormattedErrors(validatorArrayIOType)
export const ActionIO = withFormattedErrors(actionIOType)
export const TransactionIO = withFormattedErrors(transactionIOType)
export const ActionTransformedIO = withFormattedErrors(actionTransformedIOType)
export const TransactionTransformedIO = withFormattedErrors(
  transactionTransformedIOType
)

export const ValidatorTransformedArrayIO = array(ValidatorTransformedIO)

export type StakesTransformed = z.infer<typeof StakesTransformedIO>
export type Validator = z.infer<typeof ValidatorIO>
export type Validators = z.infer<typeof validatorArrayIOType>
export type ValidatorTransformed = z.infer<typeof ValidatorTransformedIO>
export type ValidatorTransformedArray = z.infer<
  typeof ValidatorTransformedArrayIO
>
export type Transaction = z.infer<typeof transactionIOType>
export type TransactionReceipt = z.infer<typeof transactionReceiptIOType>
export type GlobalEntityId = z.infer<typeof globalEntityIdIOType>
