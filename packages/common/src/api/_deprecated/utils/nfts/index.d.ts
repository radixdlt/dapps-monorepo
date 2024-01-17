import type { GeneralNft } from './general-nft';
import { type ClaimNft } from './claim-nft';
import { type NftDataItem, type KnownStandardTypes } from '../nft-data';
export type _NonFungible<Type extends string, StandardNftData extends (keyof KnownStandardTypes)[]> = {
    type: Type;
    address: NonFungibleAddress;
    id: string;
    nftData: {
        standard: Partial<{
            [K in StandardNftData[number]]: NftDataItem<K>;
        }>;
        nonStandard: NftDataItem[];
        all: NftDataItem[];
    };
};
export type NonFungible = GeneralNft | ClaimNft;
export type NonFungibleAddress<R extends string = string, I extends string = string> = {
    resourceAddress: R;
    id: I;
    nonFungibleAddress: `${R}:${I}`;
};
export declare const transformNft: (resource_address: NonFungibleResourcesCollectionItemVaultAggregated, { non_fungible_id, data }: StateNonFungibleDetailsResponseItem) => NonFungible;
