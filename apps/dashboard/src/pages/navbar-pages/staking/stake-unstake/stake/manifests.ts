import { xrdAddress } from '@stores'
import BigNumber from 'bignumber.js'

let xrd: string | undefined

xrdAddress.subscribe((xrdAddress) => {
  xrd = xrdAddress
})

export const getStakeManifest = (
  accountAddress: string,
  validatorAddress: string,
  amount: string
) => `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${xrd}")
      Decimal("${amount}");

    TAKE_ALL_FROM_WORKTOP
      Address("${xrd}")
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
        Address("${xrd}")
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
            Address("${xrd}")
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
