import { derived } from 'svelte/store'
import type { LayoutLoad } from './$types'
import type { Account } from '@stores'
import type { StakeInfo } from '../../+layout.svelte'
import BigNumber from 'bignumber.js'
import type { Validator } from '@api/utils/validators'

export const load: LayoutLoad = ({ parent }) =>
  parent().then((data) => {
    const stakes = derived(data.stakeInfo, async ($info) => {
      const info = await $info
      const validator = await data.promises.validator

      const staking = info.staked.filter(
        (stake) => stake.validator.address === validator.address
      )
      const unstaking = info.unstaking.filter(
        (stake) => stake.validator.address === validator.address
      )
      const readyToClaim = info.readyToClaim.filter(
        (stake) => stake.validator.address === validator.address
      )

      const allAccounts = new Map<string, Account>()

      const addAccount = (account: Account) => {
        if (!allAccounts.has(account.address)) {
          allAccounts.set(account.address, account)
        }
      }

      staking.forEach((entry) => addAccount(entry.account))
      unstaking.forEach((entry) => addAccount(entry.account))
      readyToClaim.forEach((entry) => addAccount(entry.account))

      const transformedData: {
        account: Account
        validator: Validator
        staked: string
        unstaking: string
        readyToClaim: string
        stakeUnits: string
      }[] = []

      for (const account of allAccounts.values()) {
        const [accumulatedStake, accumulatedUnstake, accumulatedClaim] = [
          staking,
          unstaking,
          readyToClaim
        ].map((arr: StakeInfo[]) =>
          arr
            .filter((entry) => entry.account.address === account.address)
            .reduce((sum, entry) => sum.plus(entry.xrdAmount), new BigNumber(0))
            .toString()
        )

        const accumulatedStakeUnits = staking
          .filter((entry) => entry.account.address === account.address)
          .reduce(
            (sum, entry) => sum.plus(entry.stakeUnitsAmount),
            new BigNumber(0)
          )
          .toString()

        transformedData.push({
          account,
          validator,
          staked: accumulatedStake,
          unstaking: accumulatedUnstake,
          readyToClaim: accumulatedClaim,
          stakeUnits: accumulatedStakeUnits
        })
      }

      return transformedData
    })

    return {
      stakes
    }
  })
