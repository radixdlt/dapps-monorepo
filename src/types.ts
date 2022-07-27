
type Action = {
    type: "TransferTokens"
    from_account: {
        address: string
    }
    to_account: {
        address: string
    }
    amount: {
        value: string
        token_identifier: {
            rri: string
        }
    }
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
            status: "CONFIRMED" | "REJECTED" | "PENDING"
            confirmed_time: string
            ledger_state_version: number
        }
    }
}