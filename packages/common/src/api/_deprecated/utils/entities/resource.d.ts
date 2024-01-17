import type { EntityMetadataItem, FungibleResourcesCollectionItemVaultAggregated, FungibleResourcesVaultCollection, LedgerStateSelector, StateEntityDetailsOptions, StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk';
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
    metadata: import("@common/utils/gateway-sdk").EntityMetadataCollection;
    details?: import("@common/utils/gateway-sdk").StateEntityDetailsResponseItemDetails | undefined;
}>(entity: E) => {
    readonly type: "resource";
    readonly totalSupply: string;
    readonly divisibility: number;
    readonly behaviors: "simple" | Behavior[];
    readonly address: string;
    readonly entity: E;
    readonly metadata: {
        standard: {
            symbol: {
                item: EntityMetadataItem;
                value: string;
            };
            name: {
                item: EntityMetadataItem;
                value: string;
            };
            description: {
                item: EntityMetadataItem;
                value: string;
            };
            tags: {
                item: EntityMetadataItem;
                value: string[];
            };
            owner_badge: {
                item: EntityMetadataItem;
                value: string;
            };
            pool_vault_number: {
                item: EntityMetadataItem;
                value: string;
            };
            pool_resources: {
                item: EntityMetadataItem;
                value: string[];
            };
            pool_unit: {
                item: EntityMetadataItem;
                value: string;
            };
            validator: {
                item: EntityMetadataItem;
                value: string;
            };
            icon_url: {
                item: EntityMetadataItem;
                value: URL;
            };
            info_url: {
                item: EntityMetadataItem;
                value: URL;
            };
            pool: {
                item: EntityMetadataItem;
                value: string;
            };
            key_image_url: {
                item: EntityMetadataItem;
                value: URL;
            };
        };
        explicit: EntityMetadataItem[];
        nonStandard: EntityMetadataItem[];
        all: EntityMetadataItem[];
    };
    readonly auth: AuthInfo;
};
export declare const transformNonFungibleResource: (entity: StateEntityDetailsVaultResponseItem) => NonFungibleResource;
export declare const transformFungibleResource: (entity: StateEntityDetailsVaultResponseItem, fungible?: FungibleResourcesCollectionItemVaultAggregated) => FungibleResource;
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
}[], stateOptions?: StateEntityDetailsOptions, ledgerState?: LedgerStateSelector) => Promise<{
    account: string;
    items: FungibleResource[];
}[]>;
export declare const transformResource: (entity: StateEntityDetailsVaultResponseItem, getEntityTypesFn: GetEntityTypesFn, getEntityDetailsFn: GetEntityDetailsFn) => Promise<FungibleResource | import("./pool-unit").PoolUnit | NonFungibleResource>;
export declare const transformResources: (stateOptions?: StateEntityDetailsOptions, ledgerState?: LedgerStateSelector, getNonFungiblesForResources?: string[]) => (accountEntities: StateEntityDetailsVaultResponseItem[], options?: Partial<{
    fungibles: boolean;
    nfts: boolean;
}>) => Promise<{
    accountAddress: string;
    details: StateEntityDetailsVaultResponseItem;
    fungible: FungibleResource[];
    nonFungible: TransformedNonFungible[];
}[]>;
export type Resources = Awaited<ReturnType<typeof getAccountData>>;
export declare const getFungibleResource: (name: string) => (resources: Omit<Resources[number], 'details' | 'accountAddress'>) => FungibleResource;
export declare const getNonFungibleResource: (name: string) => (resources: Omit<Resources[number], 'details' | 'accountAddress'>) => NonFungibleResource;
export declare const getAccountData: (accounts: string[], options?: StateEntityDetailsOptions, ledgerState?: LedgerStateSelector, getNonFungiblesForResources?: string[]) => Promise<{
    accountAddress: string;
    details: StateEntityDetailsVaultResponseItem;
    fungible: FungibleResource[];
    nonFungible: TransformedNonFungible[];
}[]>;
export declare const getAccountFungibleTokens: (accounts: string) => Promise<{
    accountAddress: string;
    details: StateEntityDetailsVaultResponseItem;
    fungible: FungibleResource[];
    nonFungible: TransformedNonFungible[];
}>;
export declare const getAccountDataNew: (accounts: string[], options?: StateEntityDetailsOptions, ledgerState?: LedgerStateSelector, getNonFungiblesForResources?: string[]) => import("neverthrow").ResultAsync<{
    accountAddress: string;
    details: StateEntityDetailsVaultResponseItem;
    fungible: FungibleResource[];
    nonFungible: TransformedNonFungible[];
}[], import("@common/utils/gateway-sdk").ErrorResponse | {
    message: string;
}>;
export {};
