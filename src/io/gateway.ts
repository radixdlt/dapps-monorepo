import z, {
  record,
  number,
  string,
  object,
  boolean,
  array,
  any,
  literal,
  union,
  date
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
    confirmed_at: date(),
    fee_paid: object({
      value: string(),
      address: string().optional()
    }),
    intent_hash_hex: string(),
    payload_hash_hex: string(),
    state_version: number(),
    transaction_status: string()
  }),
  details: object({
    raw_hex: string(),
    message_hex: string().optional(),
    receipt: object({
      status: string(),
      error_message: string().nullable()
    }),
    referenced_global_entities: array(string())
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
      address: string(),
      metadata: object({
        items: array(
          object({
            key: string(),
            value: string()
          })
        ).optional()
      })
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
        amount: object({
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
        amount: number()
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
    discriminator: literal('fungible_resource').or(
      literal('non_fungible_resource')
    ),
    divisibility: number().optional(),
    total_supply: string().optional(),
    total_minted: string().optional(),
    total_burnt: string().optional()
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

export const NonFungibleIDsIO = object({
  address: string(),
  resource_address: string(),
  non_fungible_ids: object({
    items: array(
      object({
        non_fungible_id: string()
      })
    )
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
export type EntityOverview = z.infer<typeof EntityOverviewIO>
export type EntityResources = z.infer<typeof EntityResourcesIO>
export type EntityDetails = z.infer<typeof EntityDetailsIO>
