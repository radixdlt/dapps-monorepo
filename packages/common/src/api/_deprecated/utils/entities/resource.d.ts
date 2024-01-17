import type { EntityMetadataItem, FungibleResourcesVaultCollection, StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk';
import { type _Entity } from '.';
import { type NonFungible } from '../nfts';
import { type GetEntityTypesFn, type GetEntityDetailsFn } from './pool-unit';
import { type AuthInfo } from '../auth';
type _Resource<T extends 'fungible' | 'non-fungible'> = _Entity<'resource', [
    'name',
    'symbol',
    'icon_url',
    'description',
    'tags'
]> & {
    resourceType: T;
    totalSupply: string;
    divisibility: number;
    metadata: {
        explicit: EntityMetadataItem[];
    };
    behaviors: 'simple' | Behavior[];
    displayName: string;
};
export type FungibleResource = _Resource<'fungible'> & {
    value: string;
};
export type NonFungibleResource = _Resource<'non-fungible'>;
export type Resource = FungibleResource | NonFungibleResource;
export type NftGlobalId = `${string}:${string}`;
export type DecoratedAccount = Awaited<ReturnType<typeof getAccountData>>[number];
export type Behavior = 'simple' | 'supply-increase' | 'supply-decrease' | 'supply-increase-decrease' | 'supply-increase-anyone' | 'supply-decrease-anyone' | 'supply-increase-decrease-anyone' | 'movement-restricted' | 'movement-restricted-future' | 'movement-restricted-future-anyone' | 'freezable' | 'freezable-anyone' | 'removable-by-third-party' | 'removable-by-anyone' | 'nft-data-changeable' | 'nft-data-changeable-anyone' | 'info-can-change' | 'info-can-change-anyone';
export declare const getBehaviors: (auth: AuthInfo) => "simple" | Behavior[];
export declare const _transformResource: <E extends {
    address: string;
    metadata: StateEntityDetailsVaultResponseItem;
    details?: any;
}>(entity: E) => {
    readonly type: "resource";
    readonly totalSupply: any;
    readonly divisibility: any;
    readonly behaviors: "simple" | Behavior[];
    readonly address: string;
    readonly entity: E;
    readonly metadata: {
        standard: {
            symbol: {
                item: EntityMetadataItem;
                value: MetadataStringValueTypeEnum;
            };
            pool: {
                item: EntityMetadataItem;
                value: MetadataGlobalAddressValueTypeEnum;
            };
            validator: {
                item: EntityMetadataItem;
                value: MetadataStringValueTypeEnum;
            };
            name: {
                item: EntityMetadataItem;
                value: MetadataStringValueTypeEnum;
            };
            tags: {
                item: EntityMetadataItem;
                value: MetadataStringArrayValueTypeEnum;
            };
            description: {
                item: EntityMetadataItem;
                value: MetadataStringValueTypeEnum;
            };
            key_image_url: {
                item: EntityMetadataItem;
                value: MetadataUrlValueTypeEnum;
            };
            owner_badge: {
                item: EntityMetadataItem;
                value: MetadataStringValueTypeEnum;
            };
            pool_vault_number: {
                item: EntityMetadataItem;
                value: MetadataStringValueTypeEnum;
            };
            pool_resources: {
                item: EntityMetadataItem;
                value: MetadataStringArrayValueTypeEnum;
            };
            pool_unit: {
                item: EntityMetadataItem;
                value: MetadataStringValueTypeEnum;
            };
            icon_url: {
                item: EntityMetadataItem;
                value: MetadataUrlValueTypeEnum;
            };
            info_url: {
                item: EntityMetadataItem;
                value: MetadataUrlValueTypeEnum;
            };
        };
        explicit: EntityMetadataItem[];
        nonStandard: any;
        all: any;
    };
    readonly auth: AuthInfo;
};
export declare const transformNonFungibleResource: (entity: StateEntityDetailsVaultResponseItem) => NonFungibleResource;
export declare const transformFungibleResource: (entity: StateEntityDetailsVaultResponseItem, fungible?: any) => FungibleResource;
export type TransformedNonFungible = {
    resource: NonFungibleResource;
    ownedNonFungibles: number;
    nonFungibles: (NonFungible | NonFungible['id'])[];
    nextCursor?: string;
    vaultAddress: string;
};
export declare const transformFungible: (accountResourceItems: {
    account: string;
    items: FungibleResourcesVaultCollection['items'];
}[], stateOptions?: any, ledgerState?: any) => Promise<{
    account: string;
    items: FungibleResource[];
}[]>;
export declare const transformResource: (entity: StateEntityDetailsVaultResponseItem, getEntityTypesFn: GetEntityTypesFn, getEntityDetailsFn: GetEntityDetailsFn) => Promise<FungibleResource | NonFungibleResource | import("./pool-unit").PoolUnit>;
export declare const transformResources: (stateOptions?: any, ledgerState?: any, getNonFungiblesForResources?: string[]) => (accountEntities: StateEntityDetailsVaultResponseItem[], options?: Partial<{
    fungibles: boolean;
    nfts: boolean;
}> | undefined) => Promise<{
    accountAddress: any;
    details: StateEntityDetailsVaultResponseItem;
    fungible: FungibleResource[];
    nonFungible: any;
}[]>;
export type Resources = Awaited<ReturnType<typeof getAccountData>>;
export declare const getFungibleResource: (name: string) => (resources: Omit<Resources[number], 'details' | 'accountAddress'>) => FungibleResource;
export declare const getNonFungibleResource: (name: string) => (resources: Omit<Resources[number], 'details' | 'accountAddress'>) => NonFungibleResource;
export declare const getAccountData: (accounts: string[], options?: any, ledgerState?: any, getNonFungiblesForResources?: string[]) => Promise<{
    accountAddress: any;
    details: StateEntityDetailsVaultResponseItem;
    fungible: FungibleResource[];
    nonFungible: any;
}[]>;
export declare const getAccountFungibleTokens: (accounts: string) => Promise<{
    accountAddress: any;
    details: StateEntityDetailsVaultResponseItem;
    fungible: FungibleResource[];
    nonFungible: any;
}>;
export declare const getAccountDataNew: (accounts: string[], options?: any, ledgerState?: any, getNonFungiblesForResources?: string[]) => any;
export {};
