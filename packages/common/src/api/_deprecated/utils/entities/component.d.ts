import BigNumber from 'bignumber.js';
import { type _Entity } from '.';
import type { StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk';
export type Component = _Entity<'component', ['name', 'description']> & {
    packageAddress: string;
    blueprintName: string;
    royalty: BigNumber;
};
export declare const transformComponent: (entity: StateEntityDetailsVaultResponseItem) => Component;
