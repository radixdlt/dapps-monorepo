import type { _Entity } from '.';
import type { FungibleResource } from './resource';
import type { StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk';
export type PoolUnit = Omit<FungibleResource, 'type'> & _Entity<'poolUnit', ['pool']>;
export type GetEntityTypesFn = (address: string[]) => Promise<{
    [address: string]: string;
}>;
export type GetEntityDetailsFn = (addresses: string[]) => Promise<StateEntityDetailsVaultResponseItem[]>;
type FungibleResourceWithPoolAddress = FungibleResource & {
    poolAddress: string;
};
export declare const resourceToPoolUnit: (resource: FungibleResource) => PoolUnit;
export declare const hasPoolMetadataSet: (resource: FungibleResource) => boolean;
export declare const verify2WayLinking: (getEntityDetailsFn: GetEntityDetailsFn) => (resources: FungibleResourceWithPoolAddress[]) => Promise<FungibleResourceWithPoolAddress[]>;
export declare const verifyPoolUnit: (getEntityTypesFn: GetEntityTypesFn, getEntityDetailsFn: GetEntityDetailsFn) => (resources: FungibleResource[]) => Promise<FungibleResourceWithPoolAddress[]>;
export declare const getPoolUnits: (resources: FungibleResource[], getEntityTypesFn: GetEntityTypesFn, getEntityDetailsFn: GetEntityDetailsFn) => Promise<PoolUnit[]>;
export {};
