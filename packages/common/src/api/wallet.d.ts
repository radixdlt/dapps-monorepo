export declare const sendTransaction: (transactionManifest: string, blobs?: string[]) => Promise<{
    transactionIntentHash: string;
    status: import("@radixdlt/babylon-gateway-api-sdk/dist/generated/models/TransactionStatus").TransactionStatus;
}>;
