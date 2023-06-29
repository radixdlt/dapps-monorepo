import { bookmarkedValidatorsApi } from './../../../server/validators/validators-api'
import type { LayoutLoad } from './$types'
import { getGatewayStatus, getValidatorsList } from '@api/gateway'
import { getAccountData, getEnumStringMetadata } from '@api/utils/resources'
import type { Validator } from '@pages/navbar-pages/staking/Validators.svelte'
import { accounts, type Account } from '@stores'
import BigNumber from 'bignumber.js'
import { derived } from 'svelte/store'
import type { StakeInfo } from './+layout.svelte'

export const prerender = false

export const _dependency = 'load:validators'

export type AccumulatedStakes = {
  [validator: string]: {
    accumulatedStakes: string
    accumulatedUnstaking: string
    accumulatedReadyToClaim: string
  }
}

export const load: LayoutLoad = ({ fetch, depends }) => {
  depends(_dependency)

  const validators = getValidatorsList().then((validators) =>
    validators.map((validator) => {
      const state: any = validator.state || {}
      return {
        name: getEnumStringMetadata('name')(validator.metadata),
        website: getEnumStringMetadata('url')(validator.metadata),
        address: validator.address,
        fee: (state.validator_fee_factor || 0) * 100,
        percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,
        totalStake: validator.current_stake,

        stakeUnitResourceAddress: (validator.state! as any)
          .stake_unit_resource_address as string,

        unstakeClaimResourceAddress: (validator.state! as any)
          .unstake_claim_token_resource_address as string,

        // TODO:
        ownerAddress: '',
        ownerStake: '0',
        percentageOwnerStake: 0,
        apy: 0,
        uptime: 0,
        acceptsStake: true
      } as Validator
    })
  )

  const bookmarkedValidators = bookmarkedValidatorsApi
    .getAll(fetch)
    .unwrapOr([]) as Promise<string[]>

  const getStakeInfo =
    (validators: Validator[]) => async (account: Account) => {
      const { fungible, nonFungible } = (
        await getAccountData([account.address])
      )[0]

      const stakes = fungible
        .filter((token) =>
          validators.some(
            (validator) => validator.stakeUnitResourceAddress === token.address
          )
        )
        .map((token) => ({
          account,
          validator: validators.find(
            (validator) => validator.stakeUnitResourceAddress === token.address
          )!,
          amount: token.value
        }))

      const unstakeTokens = nonFungible.filter((token) =>
        validators.some(
          (validator) => validator.unstakeClaimResourceAddress === token.address
        )
      )

      const currentEpoch = (await getGatewayStatus()).ledger_state.epoch

      let unstaking: StakeInfo[] = []
      let readyToClaim: StakeInfo[] = []

      for (const token of unstakeTokens) {
        const isClaimable = new BigNumber(token.unstakeData.claimEpoch).lte(
          currentEpoch
        )

        ;(() => (isClaimable ? readyToClaim : unstaking))().push({
          account,
          validator: validators.find(
            (validator) =>
              validator.unstakeClaimResourceAddress === token.address
          )!,
          amount: token.unstakeData.unstakeAmount
        })
      }

      return {
        stakes,
        unstaking,
        readyToClaim
      }
    }

  const stakes = derived(accounts, ($accounts) => {
    if ($accounts.length > 0) {
      return validators
        .then((validators) =>
          Promise.all($accounts.map(getStakeInfo(validators)))
        )
        .then((info) => {
          const stakes = info.reduce(
            (acc, { stakes }) => [...acc, ...stakes],
            [] as (typeof info)[number]['stakes']
          )

          const unstaking = info.reduce(
            (acc, { unstaking }) => [...acc, ...unstaking],
            [] as (typeof info)[number]['unstaking']
          )

          const readyToClaim = info.reduce(
            (acc, { readyToClaim }) => [...acc, ...readyToClaim],
            [] as (typeof info)[number]['readyToClaim']
          )

          return {
            stakes,
            unstaking,
            readyToClaim
          }
        })
    } else {
      return new Promise<{
        stakes: StakeInfo[]
        unstaking: StakeInfo[]
        readyToClaim: StakeInfo[]
      }>(() => {})
    }
  })

  const validatorAccumulatedStakes = derived(stakes, ($stakes) =>
    $stakes.then(async ({ stakes, unstaking, readyToClaim }) => {
      const _validators = await validators

      return _validators.reduce<AccumulatedStakes>((prev, cur) => {
        const [
          accumulatedStakes,
          accumulatedUnstaking,
          accumulatedReadyToClaim
        ] = [stakes, unstaking, readyToClaim].map((s) =>
          s
            .filter((s) => s.validator.address === cur.address)
            .reduce((acc, { amount }) => acc.plus(amount), new BigNumber(0))
            .toString()
        )

        prev[cur.address] = {
          accumulatedStakes,
          accumulatedUnstaking,
          accumulatedReadyToClaim
        }
        return prev
      }, {})
    })
  )

  return {
    validatorAccumulatedStakes,
    stakes,
    promises: {
      validators,
      bookmarkedValidators
    }
  }
}
