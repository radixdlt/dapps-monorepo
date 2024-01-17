import { type AuthInfo } from '../auth';
import { type KnownStandardTypes, type MetadataTypeToNativeType } from '../metadata';
import type { Component } from './component';
import type { Package } from './package';
import type { PoolUnit } from './pool-unit';
import type { Resource } from './resource';
import type { Validator } from './validator';
import type { EntityMetadataItem } from '@common/utils/gateway-sdk';
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
    metadata: StateEntityDetailsVaultResponseItem;
    details?: any;
}>(entity: E) => {
    address: string;
    entity: E;
    metadata: {
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
    auth: AuthInfo;
};
