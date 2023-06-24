import { CURRENT_NETWORK } from '@networks'
import BigNumber from 'bignumber.js'

export const getStakeManifest = (
  accountAddress: string,
  validatorAddress: string,
  amount: string
) => `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${CURRENT_NETWORK.xrdAddress}")
      Decimal("${amount}");

    TAKE_ALL_FROM_WORKTOP
      Address("${CURRENT_NETWORK.xrdAddress}")
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
  stakes: { validator: string; amount: string }[]
) => `
        CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${CURRENT_NETWORK.xrdAddress}")
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
            Address("${CURRENT_NETWORK.xrdAddress}")
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
