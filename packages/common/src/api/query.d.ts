export declare const query: <Fn extends "sendTransaction" | "getAccountData", Input extends Parameters<{
    getAccountData: (accounts: string[], options?: import("@radixdlt/babylon-gateway-api-sdk").StateEntityDetailsOptions | undefined, ledgerState?: import("@radixdlt/babylon-gateway-api-sdk").LedgerStateSelector | undefined, getNonFungiblesForResources?: string[] | undefined) => Promise<{
        accountAddress: string;
        details: import("@radixdlt/babylon-gateway-api-sdk").StateEntityDetailsVaultResponseItem;
        fungible: import("./_deprecated/utils/entities/resource").FungibleResource[];
        nonFungible: import("./_deprecated/utils/entities/resource").TransformedNonFungible[];
    }[]>;
    sendTransaction: (transactionManifest: string, blobs?: string[] | undefined) => Promise<{
        transactionIntentHash: string;
        status: import("@radixdlt/babylon-gateway-api-sdk").TransactionStatus;
    }>;
}[Fn]>>(fn: Fn) => {
    send: (...input: Input) => void;
    loading: import("svelte/store").Writable<boolean>;
    response: import("svelte/store").Writable<Awaited<ReturnType<{
        getAccountData: (accounts: string[], options?: import("@radixdlt/babylon-gateway-api-sdk").StateEntityDetailsOptions | undefined, ledgerState?: import("@radixdlt/babylon-gateway-api-sdk").LedgerStateSelector | undefined, getNonFungiblesForResources?: string[] | undefined) => Promise<{
            accountAddress: string;
            details: import("@radixdlt/babylon-gateway-api-sdk").StateEntityDetailsVaultResponseItem;
            fungible: import("./_deprecated/utils/entities/resource").FungibleResource[];
            nonFungible: import("./_deprecated/utils/entities/resource").TransformedNonFungible[];
        }[]>;
        sendTransaction: (transactionManifest: string, blobs?: string[] | undefined) => Promise<{
            transactionIntentHash: string;
            status: import("@radixdlt/babylon-gateway-api-sdk").TransactionStatus;
        }>;
    }[Fn]>> | null>;
    error: import("svelte/store").Writable<Error | null>;
};
