type TokenAmount = {
  value: string
  token_identifier: {
    rri: string
  }
}

type Action = {
  type: 'TransferTokens'
  from_account: {
    address: string
  }
  to_account: {
    address: string
  }
  amount: TokenAmount
  metadata: {
    hex: string
  }
}

export type Transaction = {
  ledger_state: {
    epoch: number
    round: number
    timestamp: string
    version: number
  }
  transaction: {
    actions: Action[]
    fee_paid: {}
    metadata: {}
    transaction_identifier: {
      hash: string
    }
    transaction_status: {
      status: 'CONFIRMED' | 'REJECTED' | 'PENDING'
      confirmed_time: string
      ledger_state_version: number
    }
  }
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

export type ValidatorsAPIResponse = {
  ledger_state: {
    epoch: number
    round: number
    timestamp: string
    version: number
  }
  validators: {
    validator_identifier: {
      address: string
    }
    stake: TokenAmount
    info: {
      owner_stake: TokenAmount
      uptime: {
        epoch_range: {
          from: number
          to: number
        }
        uptime_percentage: number
        proposals_missed: number
        proposals_completed: number
      }
    }
    properties: {
      url: string
      validator_fee_percentage: number
      name: string
      registered: boolean
      owner_account_identifier: {
        address: string
      }
      external_stake_accepted: boolean
    }
    latest_fork_readiness_signal: {
      signalled_at: {
        version: number
        timestamp: string
        epoch: number
        round: number
      }
      fork_id: string
      fork_name: string
    }
  }[]
}

export type Validators = Validator[]
