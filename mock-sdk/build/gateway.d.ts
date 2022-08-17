declare type TokenAmount = {
    value: string;
    token_identifier: {
        rri: string;
    };
};
declare type Action = {
    type: 'TransferTokens';
    from_account: {
        address: string;
    };
    to_account: {
        address: string;
    };
    amount: TokenAmount;
    metadata: {
        hex: string;
    };
};
declare type TransactionAPIResponse = {
    ledger_state: {
        epoch: number;
        round: number;
        timestamp: string;
        version: number;
    };
    transaction: {
        actions: Action[];
        fee_paid: {};
        metadata: {};
        transaction_identifier: {
            hash: string;
        };
        transaction_status: {
            status: 'CONFIRMED' | 'REJECTED' | 'PENDING';
            confirmed_time: string;
            ledger_state_version: number;
        };
    };
};
declare type ValidatorsAPIResponse = {
    ledger_state: {
        epoch: number;
        round: number;
        timestamp: string;
        version: number;
    };
    validators: Array<{
        validator_identifier: {
            address: string;
        };
        stake: TokenAmount;
        info: {
            owner_stake: TokenAmount;
            uptime: {
                epoch_range: {
                    from: number;
                    to: number;
                };
                uptime_percentage: number;
                proposals_missed: number;
                proposals_completed: number;
            };
        };
        properties: {
            url: string;
            validator_fee_percentage: number;
            name: string;
            registered: boolean;
            owner_account_identifier: {
                address: string;
            };
            external_stake_accepted: boolean;
        };
        latest_fork_readiness_signal: {
            signalled_at: {
                version: number;
                timestamp: string;
                epoch: number;
                round: number;
            };
            fork_id: string;
            fork_name: string;
        };
    }>;
};
declare type StakesAPIResponse = {
    pending_stakes: Array<{
        validator_identifier: string;
        value: string;
    }>;
    stakes: Array<{
        validator_identifier: string;
        value: string;
    }>;
};
export declare const Gateway: {
    transactionStatus: (txID: string) => (networkUrl: string) => Promise<TransactionAPIResponse>;
    validators: (networkUrl: string) => Promise<ValidatorsAPIResponse>;
    getStakePositions: (address: string) => (networkUrl: string) => Promise<StakesAPIResponse>;
};
export {};
