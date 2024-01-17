import type { EntityMetadataCollection, EntityMetadataItem, MetadataGlobalAddressValueTypeEnum, MetadataStringArrayValueTypeEnum, MetadataStringValueTypeEnum, MetadataUrlValueTypeEnum, StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk';
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
export type MetadataTypeToNativeType = {
    [MetadataStringValueTypeEnum.String]: string;
    [MetadataUrlValueTypeEnum.Url]: URL;
    [MetadataStringArrayValueTypeEnum.StringArray]: string[];
    [MetadataGlobalAddressValueTypeEnum.GlobalAddress]: string;
};
export declare const getMetadataItem: (key: string) => (metadata?: EntityMetadataCollection) => EntityMetadataItem | undefined;
export declare const getEnumStringMetadataValue: (item: EntityMetadataItem) => string;
export declare const getStringMetadataValue: (item: EntityMetadataItem) => string;
export declare const getVectorMetadataValue: (item: EntityMetadataItem) => string[];
export declare const getEnumStringMetadata: (key: string) => (metadata: EntityMetadataCollection) => string;
export declare const getStringMetadata: (key: string) => (metadata: EntityMetadataCollection) => string;
export declare const getVectorMetadata: (key: string) => (metadata: EntityMetadataCollection) => string[];
export declare const transformMetadata: <T extends (keyof KnownStandardTypes)[]>(metadata: {
    metadata: StateEntityDetailsVaultResponseItem['metadata'];
    explicit_metadata?: StateEntityDetailsVaultResponseItem['explicit_metadata'];
}, standardEntries: T) => {
    standard: { [K in T[number]]: {
        item: EntityMetadataItem;
        value: MetadataTypeToNativeType[KnownStandardTypes[K]];
    }; };
    explicit: EntityMetadataItem[];
    nonStandard: EntityMetadataItem[];
    all: EntityMetadataItem[];
};
