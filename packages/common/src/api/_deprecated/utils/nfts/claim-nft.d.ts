import type { _NonFungible } from '.';
import type { StateNonFungibleDetailsResponseItem } from '@common/utils/gateway-sdk';
export type ClaimNft = _NonFungible<'claimNft', [
    'name',
    'claim_amount',
    'claim_epoch'
]>;
export declare const isUnstakeData: (data: StateNonFungibleDetailsResponseItem['data']) => data is import("@common/utils/gateway-sdk").ScryptoSborValue & {
    programmatic_json: {
        fields: [
            {
                kind: 'String';
                field_name: 'name';
                value: string;
            },
            {
                kind: 'U64';
                type_name: 'Epoch';
                field_name: 'claim_epoch';
                value: string;
            },
            {
                kind: 'Decimal';
                field_name: 'claim_amount';
                value: string;
            }
        ];
    };
};
export declare const getUnstakeData: (data: StateNonFungibleDetailsResponseItem['data']) => {
    claimEpoch: string;
    claimAmount: string;
} | undefined;
