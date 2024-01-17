import type { MetadataGlobalAddressValueTypeEnum, MetadataStringArrayValueTypeEnum, MetadataStringValueTypeEnum, MetadataUrlValueTypeEnum, StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk';
export type KnownStandardTypes = {
    name: MetadataStringValueTypeEnum;
    description: MetadataStringValueTypeEnum;
    tags: MetadataStringArrayValueTypeEnum;
    owner_badge: MetadataStringValueTypeEnum;
    pool_vault_number: MetadataStringValueTypeEnum;
    pool_resources: MetadataStringArrayValueTypeEnum;
    pool_unit: MetadataStringValueTypeEnum;
    validator: MetadataStringValueTypeEnum;
    symbol: MetadataStringValueTypeEnum;
    icon_url: MetadataUrlValueTypeEnum;
    info_url: MetadataUrlValueTypeEnum;
    pool: MetadataGlobalAddressValueTypeEnum;
    key_image_url: MetadataUrlValueTypeEnum;
};
export type MetadataTypeToNativeType = {};
export declare const getMetadataItem: (key: string) => (metadata?: any) => any;
export declare const getEnumStringMetadataValue: (item: EntityMetadataItem) => string;
export declare const getStringMetadataValue: (item: EntityMetadataItem) => string;
export declare const getVectorMetadataValue: (item: EntityMetadataItem) => string[];
export declare const getEnumStringMetadata: (key: string) => (metadata: EntityMetadataCollection) => string;
export declare const getStringMetadata: (key: string) => (metadata: EntityMetadataCollection) => string;
export declare const getVectorMetadata: (key: string) => (metadata: EntityMetadataCollection) => string[];
export declare const transformMetadata: <T extends (keyof KnownStandardTypes)[]>(metadata: {
    metadata: StateEntityDetailsVaultResponseItem;
    explicit_metadata?: any;
}, standardEntries: T) => {
    standard: { [K in T[number]]: {
        item: EntityMetadataItem;
        value: MetadataTypeToNativeType[KnownStandardTypes[K]];
    }; };
    explicit: EntityMetadataItem[];
    nonStandard: any;
    all: any;
};
