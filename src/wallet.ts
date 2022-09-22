import WalletSdk from "@radixdlt/wallet-sdk";

const sdk = WalletSdk()

export const sendTransaction = sdk.sendTransaction

export const request = sdk.request