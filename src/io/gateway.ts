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

export const ActionIO = object({
  from_account: object({ address: string() }),
  to_account: object({ address: string() }),
  amount: object({ value: string() })
})

export const TransactionIO = object({
  transaction: object({
    transaction_status: object({
      status: string(),
      confirmed_at: string().optional()
    }),
    fee_paid: object({
      value: string(),
      address: string().optional()
    })
  }),
  details: object({
    raw_hex: string(),
    message_hex: string().optional()
  })
})

export const ActionTransformedIO = object({
  from: string(),
  to: string(),
  amount: number()
})

export const TransactionTransformedIO = object({
  status: string()
})

const EntityType = union([
  literal('System'),
  literal('ResourceManager'),
  literal('Component'),
  literal('Package'),
  literal('Vault'),
  literal('KeyValueStore')
])

export const GlobalEntityIdIO = object({
  entity_type: EntityType,
  entity_address_hex: string(),
  global_address_hex: string(),
  global_address: string()
})

export const EntityOverviewIO = object({
  entities: array(
    object({
      address: string()
    })
  )
})

export const EntityResourcesIO = object({
  address: string(),
  fungible_resources: object({
    total_count: number(),
    items: array(
      object({
        address: string(),
        total_count: object({
          value: string(),
          address: string()
        }).optional()
      })
    ).optional()
  }),
  non_fungible_resources: object({
    total_count: number(),
    items: array(
      object({
        address: string(),
        total_count: number()
      })
    ).optional()
  })
})

export const EntityDetailsIO = object({
  address: string(),
  metadata: object({
    total_count: number(),
    items: array(
      object({
        key: string(),
        value: string()
      })
    )
  }),
  details: object({
    discriminator: string(),
    divisibility: number(),
    total_supply: object({
      value: string(),
      address: string()
    }),
    total_minted: object({
      value: string(),
      address: string()
    }),
    total_burnt: object({
      value: string(),
      address: string()
    })
  })
})

export const EntityMetadata = object({
  address: string(),
  metadata: object({
    total_count: number(),
    items: array(
      object({
        key: string(),
        value: string()
      })
    )
  })
})

export const TransactionReceiptIO = object({
  committed: object({
    receipt: object({
      state_updates: object({ new_global_entities: array(GlobalEntityIdIO) })
    })
  })
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
export type Transaction = z.infer<typeof TransactionIO>
export type TransactionTransformed = z.infer<typeof TransactionTransformedIO>
export type TransactionReceipt = z.infer<typeof TransactionReceiptIO>
export type GlobalEntityId = z.infer<typeof GlobalEntityIdIO>
