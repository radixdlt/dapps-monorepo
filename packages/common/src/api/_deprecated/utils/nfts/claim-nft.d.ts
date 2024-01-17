import type { _NonFungible } from '.';
export type ClaimNft = _NonFungible<'claimNft', [
    'name',
    'claim_amount',
    'claim_epoch'
]>;
export declare const isUnstakeData: (data: StateNonFungibleDetailsResponseItem) => data is any;
export declare const getUnstakeData: (data: StateNonFungibleDetailsResponseItem) => {
    claimEpoch: any;
    claimAmount: any;
} | undefined;
