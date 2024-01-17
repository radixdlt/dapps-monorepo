import { type ResultAsync } from 'neverthrow';
import { GatewayApiClient, type ErrorResponse, type StateEntityDetailsOptions, type StateNonFungibleDetailsResponseItem, type LedgerStateSelector, type StreamTransactionsResponse } from '@common/utils/gateway-sdk';
declare const gatewayApi: GatewayApiClient;
declare const handleError: (error: unknown) => ErrorResponse;
declare const api: {
    innerClient: never;
    configuration: never;
    getValidatorsUptimeFromTo: (addresses: string[], from?: number | Date | undefined, to?: number | Date | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorUptimeCollectionItem[]>;
    getValidatorsUptime: (validator_addresses: string[]) => Promise<import("@common/utils/gateway-sdk").ValidatorsUptimeResponse>;
    getStatus: (transactionIntentHash: string) => Promise<import("@common/utils/gateway-sdk").TransactionStatusResponse>;
    getCommittedDetails: (transactionIntentHash: string, options?: {
        rawHex: false;
        receiptEvents: false;
        receiptFeeSource: false;
        receiptFeeSummary: false;
        receiptFeeDestination: false;
        receiptCostingParameters: false;
        receiptStateChanges: false;
        affectedGlobalEntities: false;
        balanceChanges: false;
        receiptOutput: false;
    } | undefined) => Promise<import("@common/utils/gateway-sdk").TransactionCommittedDetailsResponse>;
    getCurrent: () => Promise<import("@common/utils/gateway-sdk").GatewayStatusResponse>;
    getNetworkConfiguration: () => Promise<import("@common/utils/gateway-sdk").NetworkConfigurationResponse>;
    getTransactionsList: (affectedEntities?: string[] | undefined, cursor?: string | undefined) => Promise<StreamTransactionsResponse>;
    getEntityDetailsVaultAggregated: {
        (addresses: string, options?: StateEntityDetailsOptions | undefined, ledgerState?: LedgerStateSelector | undefined): Promise<import("@common/utils/gateway-sdk").StateEntityDetailsVaultResponseItem>;
        (addresses: string[], options?: StateEntityDetailsOptions | undefined, ledgerState?: LedgerStateSelector | undefined): Promise<import("@common/utils/gateway-sdk").StateEntityDetailsVaultResponseItem[]>;
    };
    getEntityMetadata: (address: string, cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").StateEntityMetadataPageResponse>;
    getNonFungibleLocation: (resource: string, ids: string[]) => Promise<import("@common/utils/gateway-sdk").StateNonFungibleLocationResponseItem[]>;
    getAllEntityMetadata: (address: string, startCursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").EntityMetadataItem[]>;
    getValidators: (cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorCollection>;
    getAllValidators: (start?: string | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorCollectionItem[]>;
    getValidatorsWithLedgerState: (cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").StateValidatorsListResponse>;
    getAllValidatorsWithLedgerState: (start?: string | undefined) => Promise<{
        aggregatedEntities: import("@common/utils/gateway-sdk").ValidatorCollectionItem[];
        ledger_state: import("@common/utils/gateway-sdk").LedgerState;
    }>;
    getNonFungibleIds: (address: string, ledgerState?: LedgerStateSelector | undefined, cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").NonFungibleIdsCollection>;
    getAllNonFungibleIds: (address: string, startCursor?: string | undefined, ledgerState?: LedgerStateSelector | undefined) => Promise<string[]>;
    getNonFungibleData: {
        (address: string, ids: string, ledgerState?: LedgerStateSelector | undefined): Promise<StateNonFungibleDetailsResponseItem>;
        (address: string, ids: string[], ledgerState?: LedgerStateSelector | undefined): Promise<StateNonFungibleDetailsResponseItem[]>;
    };
};
export declare const callApi: <T extends "innerClient" | "configuration" | "getEntityDetailsVaultAggregated" | "getEntityMetadata" | "getNonFungibleLocation" | "getAllEntityMetadata" | "getValidators" | "getAllValidators" | "getValidatorsWithLedgerState" | "getAllValidatorsWithLedgerState" | "getNonFungibleIds" | "getAllNonFungibleIds" | "getNonFungibleData" | "getTransactionsList" | "getCurrent" | "getNetworkConfiguration" | "getStatus" | "getCommittedDetails" | "getValidatorsUptimeFromTo" | "getValidatorsUptime">(methodName: T, ...args: Parameters<{
    innerClient: never;
    configuration: never;
    getValidatorsUptimeFromTo: (addresses: string[], from?: number | Date | undefined, to?: number | Date | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorUptimeCollectionItem[]>;
    getValidatorsUptime: (validator_addresses: string[]) => Promise<import("@common/utils/gateway-sdk").ValidatorsUptimeResponse>;
    getStatus: (transactionIntentHash: string) => Promise<import("@common/utils/gateway-sdk").TransactionStatusResponse>;
    getCommittedDetails: (transactionIntentHash: string, options?: {
        rawHex: false;
        receiptEvents: false;
        receiptFeeSource: false;
        receiptFeeSummary: false;
        receiptFeeDestination: false;
        receiptCostingParameters: false;
        receiptStateChanges: false;
        affectedGlobalEntities: false;
        balanceChanges: false;
        receiptOutput: false;
    } | undefined) => Promise<import("@common/utils/gateway-sdk").TransactionCommittedDetailsResponse>;
    getCurrent: () => Promise<import("@common/utils/gateway-sdk").GatewayStatusResponse>;
    getNetworkConfiguration: () => Promise<import("@common/utils/gateway-sdk").NetworkConfigurationResponse>;
    getTransactionsList: (affectedEntities?: string[] | undefined, cursor?: string | undefined) => Promise<StreamTransactionsResponse>;
    getEntityDetailsVaultAggregated: {
        (addresses: string, options?: StateEntityDetailsOptions | undefined, ledgerState?: LedgerStateSelector | undefined): Promise<import("@common/utils/gateway-sdk").StateEntityDetailsVaultResponseItem>;
        (addresses: string[], options?: StateEntityDetailsOptions | undefined, ledgerState?: LedgerStateSelector | undefined): Promise<import("@common/utils/gateway-sdk").StateEntityDetailsVaultResponseItem[]>;
    };
    getEntityMetadata: (address: string, cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").StateEntityMetadataPageResponse>;
    getNonFungibleLocation: (resource: string, ids: string[]) => Promise<import("@common/utils/gateway-sdk").StateNonFungibleLocationResponseItem[]>;
    getAllEntityMetadata: (address: string, startCursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").EntityMetadataItem[]>;
    getValidators: (cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorCollection>;
    getAllValidators: (start?: string | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorCollectionItem[]>;
    getValidatorsWithLedgerState: (cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").StateValidatorsListResponse>;
    getAllValidatorsWithLedgerState: (start?: string | undefined) => Promise<{
        aggregatedEntities: import("@common/utils/gateway-sdk").ValidatorCollectionItem[];
        ledger_state: import("@common/utils/gateway-sdk").LedgerState;
    }>;
    getNonFungibleIds: (address: string, ledgerState?: LedgerStateSelector | undefined, cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").NonFungibleIdsCollection>;
    getAllNonFungibleIds: (address: string, startCursor?: string | undefined, ledgerState?: LedgerStateSelector | undefined) => Promise<string[]>;
    getNonFungibleData: {
        (address: string, ids: string, ledgerState?: LedgerStateSelector | undefined): Promise<StateNonFungibleDetailsResponseItem>;
        (address: string, ids: string[], ledgerState?: LedgerStateSelector | undefined): Promise<StateNonFungibleDetailsResponseItem[]>;
    };
}[T]>) => ResultAsync<Awaited<ReturnType<{
    innerClient: never;
    configuration: never;
    getValidatorsUptimeFromTo: (addresses: string[], from?: number | Date | undefined, to?: number | Date | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorUptimeCollectionItem[]>;
    getValidatorsUptime: (validator_addresses: string[]) => Promise<import("@common/utils/gateway-sdk").ValidatorsUptimeResponse>;
    getStatus: (transactionIntentHash: string) => Promise<import("@common/utils/gateway-sdk").TransactionStatusResponse>;
    getCommittedDetails: (transactionIntentHash: string, options?: {
        rawHex: false;
        receiptEvents: false;
        receiptFeeSource: false;
        receiptFeeSummary: false;
        receiptFeeDestination: false;
        receiptCostingParameters: false;
        receiptStateChanges: false;
        affectedGlobalEntities: false;
        balanceChanges: false;
        receiptOutput: false;
    } | undefined) => Promise<import("@common/utils/gateway-sdk").TransactionCommittedDetailsResponse>;
    getCurrent: () => Promise<import("@common/utils/gateway-sdk").GatewayStatusResponse>;
    getNetworkConfiguration: () => Promise<import("@common/utils/gateway-sdk").NetworkConfigurationResponse>;
    getTransactionsList: (affectedEntities?: string[] | undefined, cursor?: string | undefined) => Promise<StreamTransactionsResponse>;
    getEntityDetailsVaultAggregated: {
        (addresses: string, options?: StateEntityDetailsOptions | undefined, ledgerState?: LedgerStateSelector | undefined): Promise<import("@common/utils/gateway-sdk").StateEntityDetailsVaultResponseItem>;
        (addresses: string[], options?: StateEntityDetailsOptions | undefined, ledgerState?: LedgerStateSelector | undefined): Promise<import("@common/utils/gateway-sdk").StateEntityDetailsVaultResponseItem[]>;
    };
    getEntityMetadata: (address: string, cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").StateEntityMetadataPageResponse>;
    getNonFungibleLocation: (resource: string, ids: string[]) => Promise<import("@common/utils/gateway-sdk").StateNonFungibleLocationResponseItem[]>;
    getAllEntityMetadata: (address: string, startCursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").EntityMetadataItem[]>;
    getValidators: (cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorCollection>;
    getAllValidators: (start?: string | undefined) => Promise<import("@common/utils/gateway-sdk").ValidatorCollectionItem[]>;
    getValidatorsWithLedgerState: (cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").StateValidatorsListResponse>;
    getAllValidatorsWithLedgerState: (start?: string | undefined) => Promise<{
        aggregatedEntities: import("@common/utils/gateway-sdk").ValidatorCollectionItem[];
        ledger_state: import("@common/utils/gateway-sdk").LedgerState;
    }>;
    getNonFungibleIds: (address: string, ledgerState?: LedgerStateSelector | undefined, cursor?: string | undefined) => Promise<import("@common/utils/gateway-sdk").NonFungibleIdsCollection>;
    getAllNonFungibleIds: (address: string, startCursor?: string | undefined, ledgerState?: LedgerStateSelector | undefined) => Promise<string[]>;
    getNonFungibleData: {
        (address: string, ids: string, ledgerState?: LedgerStateSelector | undefined): Promise<StateNonFungibleDetailsResponseItem>;
        (address: string, ids: string[], ledgerState?: LedgerStateSelector | undefined): Promise<StateNonFungibleDetailsResponseItem[]>;
    };
}[T]>>, ErrorResponse>;
export declare const getRecentTransactions: (address: string, cursor?: string) => Promise<StreamTransactionsResponse>;
export declare const getRecentNetworkTransactions: (cursor?: string) => ResultAsync<StreamTransactionsResponse, ErrorResponse>;
export declare const getTransactionsFromDate: (address: string, timestamp: Date, cursor?: string) => Promise<StreamTransactionsResponse>;
export declare const getValidatorsList: () => Promise<import("@common/utils/gateway-sdk").ValidatorCollectionItem[]>;
export type GetNonFungibleIdsPageWithDataRequest = {
    componentAddress: string;
    resourceAddress: string;
    vaultAddress: string;
    cursor?: string;
    stateVersion?: number;
};
export declare const getValidatorsListWithLedgerState: () => Promise<{
    aggregatedEntities: import("@common/utils/gateway-sdk").ValidatorCollectionItem[];
    ledger_state: import("@common/utils/gateway-sdk").LedgerState;
}>;
export declare const getGatewayStatus: () => Promise<import("@common/utils/gateway-sdk").GatewayStatusResponse>;
export declare const getTransactionDetails: (intentHashHex: string, optIns?: Parameters<typeof gatewayApi.transaction.getCommittedDetails>[1]) => Promise<{
    epoch: number;
    round: number;
    status: import("@common/utils/gateway-sdk").TransactionStatus;
    date: Date | null | undefined;
    fee: string | undefined;
    message: any;
    encodedManifest: string | undefined;
    receipt: import("@common/utils/gateway-sdk").TransactionReceipt | undefined;
    events: string;
    affectedEntities: string[];
    createdEntities: any[];
    stateVersion: number;
    balanceChanges: import("@common/utils/gateway-sdk").TransactionBalanceChanges | null | undefined;
}>;
export declare const getTransactionDetailsNew: (intentHashHex: string, optIns?: Parameters<typeof gatewayApi.transaction.getCommittedDetails>[1]) => ResultAsync<{
    epoch: number;
    round: number;
    status: import("@common/utils/gateway-sdk").TransactionStatus;
    date: Date | null | undefined;
    fee: string | undefined;
    message: any;
    encodedManifest: string | undefined;
    receipt: import("@common/utils/gateway-sdk").TransactionReceipt | undefined;
    events: string;
    affectedEntities: string[];
    createdEntities: any[];
    stateVersion: number;
    balanceChanges: import("@common/utils/gateway-sdk").TransactionBalanceChanges | null | undefined;
}, ErrorResponse>;
export declare const getNetworkConfiguration: () => Promise<import("@common/utils/gateway-sdk").NetworkConfigurationResponse>;
export declare const getSingleEntityDetails: (address: string, options?: StateEntityDetailsOptions) => Promise<import("@common/utils/gateway-sdk").StateEntityDetailsVaultResponseItem>;
export declare const getEntityDetails: (addresses: string[], options?: StateEntityDetailsOptions, ledgerState?: LedgerStateSelector) => Promise<import("@common/utils/gateway-sdk").StateEntityDetailsVaultResponseItem[]>;
export declare const getEntityNonFungibleIDs: (accountAddress: string, nftAddress: string, vaultAddress: string) => Promise<import("@common/utils/gateway-sdk").StateEntityNonFungibleIdsPageResponse>;
export declare const getEntityNonFungibleVaults: (accountAddress: string, resourceAddress: string) => Promise<import("@common/utils/gateway-sdk").StateEntityNonFungibleResourceVaultsPageResponse>;
export declare const getNonFungibleData: (address: string, ids: string[]) => Promise<StateNonFungibleDetailsResponseItem[]>;
export declare const getNonFungiblesIdsPageWithData: ({ componentAddress, resourceAddress, vaultAddress, cursor, stateVersion }: GetNonFungibleIdsPageWithDataRequest) => Promise<[import("@common/utils/gateway-sdk").StateEntityNonFungibleIdsPageResponse, StateNonFungibleDetailsResponseItem[]]>;
export declare const getNonFungibleIDs: (address: string) => Promise<string[]>;
export declare const getValidatorUptime: (addresses: string[], from?: Date | number, to?: Date | number) => Promise<import("@common/utils/gateway-sdk").ValidatorUptimeCollectionItem[]>;
export declare const getNonFungibleLocation: (resource: string, ids: string[]) => Promise<import("@common/utils/gateway-sdk").StateNonFungibleLocationResponseItem[]>;
export {};
