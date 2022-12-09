import { type ResultAsync } from "neverthrow";
export declare const Wallet: {
    isAvailable: () => boolean;
    connect: (name: string, info?: UserInfoRequest) => ResultAsync<UserInfo, Error>;
    requestInfo: () => void;
    requestProof: () => void;
    sendTransaction: (manifest: Transaction) => void;
};
export declare const Transaction: (instructions: Instruction[]) => Transaction;
export declare type Transaction = any;
export declare type Instruction = any;
export declare type Account = {
    label: string;
    address: string;
};
export declare type UserInfo = {
    accounts: Account[];
    profile?: Record<string, string>;
    identity?: string;
};
declare type UserInfoRequest = {
    accounts?: string[] | 'any';
    profile?: Record<string, string>;
};
export {};
