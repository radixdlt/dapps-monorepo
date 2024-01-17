import type { MetadataStringValueTypeEnum, MetadataTypedValue, MetadataUrlValueTypeEnum } from '@common/utils/gateway-sdk';
export type NftDataItem<N extends keyof KnownStandardTypes | string = string> = {
    kind: MetadataTypedValue['type'];
    field_name: N;
    value: string;
    type_name?: string;
};
export type KnownStandardTypes = {
    name: MetadataStringValueTypeEnum;
    description: MetadataStringValueTypeEnum;
    key_image_url: MetadataUrlValueTypeEnum;
    claim_amount: MetadataStringValueTypeEnum;
    claim_epoch: MetadataStringValueTypeEnum;
};
export declare const getNftData: (data: StateNonFungibleDetailsResponseItem, key: string) => any;
export declare const transformNftData: <T extends (keyof KnownStandardTypes)[]>(data: StateNonFungibleDetailsResponseItem, standardEntries: T) => {
    standard: { [K in T[number]]: NftDataItem<K>; };
    nonStandard: NftDataItem<string>[];
    all: unknown[];
};
