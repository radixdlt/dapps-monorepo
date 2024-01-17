import { type AuthInfo } from '../auth';
import { type KnownStandardTypes, type MetadataTypeToNativeType } from '../metadata';
import type { Component } from './component';
import type { Package } from './package';
import type { PoolUnit } from './pool-unit';
import type { Resource } from './resource';
import type { Validator } from './validator';
import type { EntityMetadataItem, StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk';
export type Entity = Package | Validator | Resource | PoolUnit | Component;
export type _Entity<Type extends string, StandardMetadata extends (keyof KnownStandardTypes)[], HasAuth = true> = {
    type: Type;
    address: string;
    metadata: {
        standard: Partial<{
            [K in StandardMetadata[number]]: {
                item: EntityMetadataItem;
                value: MetadataTypeToNativeType[KnownStandardTypes[K]];
            };
        } & {
            tags: {
                item: EntityMetadataItem;
                value: MetadataTypeToNativeType[KnownStandardTypes['tags']];
            };
        }>;
        nonStandard: EntityMetadataItem[];
        explicit: EntityMetadataItem[];
        all: EntityMetadataItem[];
    };
} & (HasAuth extends true ? {
    auth: AuthInfo;
} : {});
export declare const transformEntity: (standardMetadata: (keyof KnownStandardTypes)[]) => <E extends {
    address: string;
    metadata: StateEntityDetailsVaultResponseItem['metadata'];
    details?: StateEntityDetailsVaultResponseItem['details'];
}>(entity: E) => {
    address: string;
    entity: E;
    metadata: {
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
    auth: AuthInfo;
};
