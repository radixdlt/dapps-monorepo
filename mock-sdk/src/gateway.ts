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

type TransactionAPIResponse = {
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

type ValidatorsAPIResponse = {
    ledger_state: {
        epoch: number
        round: number
        timestamp: string
        version: number
    }
    validators: Array<{
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
    }>
}

type StakesAPIResponse = {
    pending_stakes: Array<{
        validator_identifier: string
        value: string
    }>
    stakes: Array<{
        validator_identifier: string
        value: string
    }>
}

const apiCall = <T>(path: string, body?: any) => (networkUrl: string): Promise<T> => fetch(networkUrl + path, {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        network_identifier: {
            network: 'mainnet'
        },
        ...body
    })
}).then(response => response.json())

const transactionStatus = (txID: string) => apiCall<TransactionAPIResponse>('/transaction/status', {
    transaction_identifier: {
        hash: txID
    }
})

const validators = apiCall<ValidatorsAPIResponse>('/validators')

const getStakePositions = (address: string) => async (networkUrl: string): Promise<StakesAPIResponse> => ({
    pending_stakes: [
        {
            validator_identifier: 'rv1qwukra5el9xl0efggr29a64kmr9t04m7a5r7zsxc8jtfr9ru7ue9u6z9g0h',
            value: '3000000000000000000000'
        }
    ],
    stakes: [
        {
            validator_identifier: 'rv1qfk9vhrzapxykvst6dk58y2pn3dj7xl44l8mklt69y7qcj86vad32rdxart',
            value: '10000000000000000000000'
        }
    ]
})

export const Gateway = {
    transactionStatus,
    validators,
    getStakePositions
}
