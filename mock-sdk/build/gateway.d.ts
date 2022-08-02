export declare const Gateway: {
    transactionStatus: (txID: string) => (networkUrl: string) => Promise<Response>;
    validators: (networkUrl: string) => Promise<Response>;
};
