import { RET_DECIMAL_PRECISION } from '@constants'
import BigNumber from 'bignumber.js'

export const getStakeManifest = (
  accountAddress: string,
  validatorAddress: string,
  stakeUnitResourceAddress: string,
  amount: string,
  xrdAddress: string
) => `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${xrdAddress}")
      Decimal("${amount}");

    TAKE_ALL_FROM_WORKTOP
      Address("${xrdAddress}")
      Bucket("bucket1");

    CALL_METHOD
      Address("${validatorAddress}")
      "stake"
      Bucket("bucket1");

    TAKE_ALL_FROM_WORKTOP
      Address("${stakeUnitResourceAddress}")
      Bucket("bucketLSU");

    CALL_METHOD
      Address("${accountAddress}")
      "deposit"
      Bucket("bucketLSU");
  `

export const getMultipleStakeManifest = (
  accountAddress: string,
  stakes: {
    validator: string
    amount: string
    preciseAmount: BigNumber
    stakeUnitResourceAddress: string
  }[],
  xrdAddress: string
) => `
        CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${xrdAddress}")
        Decimal("${stakes
          .reduce(
            (acc, { preciseAmount }) => acc.plus(preciseAmount),
            new BigNumber(0)
          )
          .toFixed(RET_DECIMAL_PRECISION)}");

        
        ${stakes
          .map(
            ({ validator, preciseAmount, stakeUnitResourceAddress }, i) => `
            TAKE_FROM_WORKTOP
              Address("${xrdAddress}")
              Decimal("${preciseAmount.toFixed(RET_DECIMAL_PRECISION)}")
              Bucket("bucket${i}");

            CALL_METHOD
              Address("${validator}")
              "stake"
              Bucket("bucket${i}");

            TAKE_ALL_FROM_WORKTOP
              Address("${stakeUnitResourceAddress}")
              Bucket("bucket${i}LSU");

            CALL_METHOD
              Address("${accountAddress}")
              "deposit"
              Bucket("bucket${i}LSU");
        `
          )
          .join(' ')}
    `

export const getUnstakeManifest = (
  unstakes: {
    accountAddress: string
    validatorAddress: string
    stakeUnitResource: string
    claimResource: string
    amount: string
  }[]
) =>
  unstakes
    .map(
      (
        {
          accountAddress,
          validatorAddress,
          stakeUnitResource,
          amount,
          claimResource
        },
        i
      ) => `
        CALL_METHOD
          Address("${accountAddress}")
          "withdraw"
          Address("${stakeUnitResource}")
          Decimal("${amount}");

        TAKE_ALL_FROM_WORKTOP
          Address("${stakeUnitResource}")
          Bucket("bucket${i}");

        CALL_METHOD
          Address("${validatorAddress}")
          "unstake"
          Bucket("bucket${i}");

        TAKE_ALL_FROM_WORKTOP
          Address("${claimResource}")
          Bucket("bucket${i}ClaimResource");

        CALL_METHOD
          Address("${accountAddress}")
          "deposit"
          Bucket("bucket${i}ClaimResource");
    `
    )
    .join(' ')

export const getClaimManifest = (
  xrdAddress: string,
  claims: {
    accountAddress: string
    validatorAddress: string
    unstakeClaimResource: string
    amount: string
    id: string
  }[]
) =>
  claims
    .map(
      (
        { accountAddress, validatorAddress, unstakeClaimResource, id, amount },
        i
      ) => `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw_non_fungibles"
      Address("${unstakeClaimResource}")
      Array<NonFungibleLocalId>(NonFungibleLocalId("${id}"));

    TAKE_ALL_FROM_WORKTOP
      Address("${unstakeClaimResource}")
      Bucket("bucket${i}");

    CALL_METHOD
      Address("${validatorAddress}")
      "claim_xrd"
      Bucket("bucket${i}");

    TAKE_FROM_WORKTOP
      Address("${xrdAddress}")
      Decimal("${amount}")
      Bucket("bucket${i}xrd");

    CALL_METHOD
      Address("${accountAddress}")
      "deposit"
      Bucket("bucket${i}xrd");
`
    )
    .join('')
