import type { ErrorResponse, LedgerState, ValidatorCollectionItem } from '@common/utils/gateway-sdk';
import type { _Entity } from '.';
import BigNumber from 'bignumber.js';
import { ResultAsync } from 'neverthrow';
export type Validator<WithOwner = false, WithUptime = false, WithStakeUnits = false> = _Entity<'validator', [
    'name',
    'icon_url',
    'description',
    'info_url'
], false> & {
    totalStakeInXRD: BigNumber;
    fee: {
        percentage: number;
        tooltip?: string;
    };
    acceptsStake: boolean;
    percentageTotalStake: number;
    stakeUnitResourceAddress: string;
    unstakeClaimResourceAddress: string;
    isRegistered: boolean;
} & (WithOwner extends true ? {
    ownerAddress: string | undefined;
} : {}) & (WithUptime extends true ? {
    uptimePercentages: {
        '1day'?: number;
        '1week'?: number;
        '1month'?: number;
        '3months'?: number;
        '6months'?: number;
        '1year'?: number;
        alltime?: number;
    };
    apy: number;
} : {}) & (WithStakeUnits extends true ? {
    totalStakeUnits: BigNumber;
    ownerStake: BigNumber;
} : {});
export declare const transformValidatorResponse: <WithOwner extends string | undefined, WithUptime extends boolean, WithStakeUnits extends boolean>(validatorOwnerBadgeResource: WithOwner, withUptime: WithUptime, withStakeUnits: WithStakeUnits) => ({ aggregatedEntities, ledger_state }: {
    aggregatedEntities: ValidatorCollectionItem[];
    ledger_state: LedgerState;
}) => ResultAsync<{
    validators: Validator<WithOwner extends string ? true : false, WithUptime, WithStakeUnits>[];
    ledger_state: LedgerState;
}, ErrorResponse>;
export declare const getValidators: <WithOwner extends string | undefined, WithUptime extends boolean, WithStakeUnits extends boolean>(validatorOwnerBadge: WithOwner, withUptime: WithUptime, withStakeUnits: WithStakeUnits) => any;
