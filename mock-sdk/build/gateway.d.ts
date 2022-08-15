export declare const Gateway: {
    transactionStatus: (txID: string) => (networkUrl: string) => Promise<Response>;
    validators: (networkUrl: string) => Promise<Response>;
    getStakePositions: (address: string) => (networkUrl: string) => Promise<{
        json: () => Promise<{
            pending_stakes: {
                validator_identifier: string;
                value: string;
            }[];
            stakes: {
                validator_identifier: string;
                value: string;
            }[];
        }>;
    }>;
};
