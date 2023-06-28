import BigNumber from 'bignumber.js'

export const getStakeManifest = (
  accountAddress: string,
  validatorAddress: string,
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

    CALL_METHOD
      Address("${accountAddress}")
      "try_deposit_batch_or_abort"
      Expression("ENTIRE_WORKTOP");
  `

export const getMultipleStakeManifest = (
  accountAddress: string,
  stakes: { validator: string; amount: string }[],
  xrdAddress: string
) => `
        CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${xrdAddress}")
        Decimal("${stakes
          .reduce(
            (acc, { amount }) => acc.plus(new BigNumber(amount)),
            new BigNumber(0)
          )
          .toString()}");

        
        ${stakes
          .map(
            ({ validator, amount }, i) => `
            TAKE_FROM_WORKTOP
            Address("${xrdAddress}")
            Decimal("${amount}")
            Bucket("bucket${i}");

            CALL_METHOD
            Address("${validator}")
            "stake"
            Bucket("bucket${i}");
        `
          )
          .join(' ')}
    

        CALL_METHOD
        Address("${accountAddress}")
        "try_deposit_batch_or_abort"
        Expression("ENTIRE_WORKTOP");
    `

export const getUnstakeManifest = (
  unstakes: {
    accountAddress: string
    validatorAddress: string
    stakeUnitResource: string
    amount: string
  }[]
) =>
  unstakes
    .map(
      ({ accountAddress, validatorAddress, stakeUnitResource, amount }, i) => `
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

        CALL_METHOD
        Address("${accountAddress}")
        "try_deposit_batch_or_abort"
        Expression("ENTIRE_WORKTOP");
    `
    )
    .join(' ')

export const getClaimManifest = (
  accountAddress: string,
  validatorAddress: string,
  unstakeNftAddress: string,
  amount: string
) => `
    CALL_METHOD
    Address("${accountAddress}")
    "withdraw"
    Address("${unstakeNftAddress}")
    Decimal("${amount}");

    TAKE_ALL_FROM_WORKTOP
    Address("${unstakeNftAddress}")
    Bucket("bucket1");

    CALL_METHOD
    Address("${validatorAddress}")
    "claim_xrd"
    Bucket("bucket1");

    CALL_METHOD
    Address("${accountAddress}")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP");
  `
