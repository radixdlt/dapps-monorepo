import type { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit';
export * from '@radixdlt/radix-dapp-toolkit';
export type RDT = RadixDappToolkit;
export declare let resolveRDT: (rdt: RDT) => void;
export declare const rdt: Promise<RadixDappToolkit>;
export declare const sendTransaction: (input: Parameters<RDT['walletApi']['sendTransaction']>[0]) => Promise<import("@radixdlt/radix-dapp-toolkit").SendTransactionResult>;
