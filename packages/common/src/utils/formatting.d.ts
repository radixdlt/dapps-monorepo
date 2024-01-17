/// <reference types="node" />
import BigNumber from 'bignumber.js';
import type { Account } from '../../../svelte-ui/src/lib/stores';
import { Buffer } from 'buffer';
type AddressPrefix = 'package' | 'resource' | 'account' | 'txid' | 'component' | 'identity' | 'pool' | 'validator';
export declare const shortenAddress: (address?: string) => string;
export declare const shortenNftID: (id: string) => string;
export declare const capitalize: (text: string) => string;
export declare const truncateNumber: (num: number) => string;
export declare const accountLabel: (account: Omit<Account, 'displayed'>) => string;
export declare const getNFTAddress: (resourceAddress: string, nftID: string) => string;
export declare const isNFTAddress: (address: string) => boolean;
export declare const getAddressPrefix: (address: string) => AddressPrefix;
export declare const formatTokenValue: (input: string | number | BigNumber, options?: Partial<{
    maxPlaces: number;
    thousandsSeparator: string;
}> | undefined) => {
    rounded: string;
    value: string;
    suffix: string;
    displayValue: string;
};
export declare const formatXRDValue: (value: string) => string;
export declare const isSameRoute: (route: string, routeName: string) => boolean;
export declare function bufferFromHex(hex: string): Buffer;
export declare function hash(message: string): Buffer;
export declare const getFileExtension: (filename: string) => string;
export declare const separateThousands: (character?: string) => (input: string) => string;
export declare const removeThousandsSeparator: (input: string) => string;
export {};
