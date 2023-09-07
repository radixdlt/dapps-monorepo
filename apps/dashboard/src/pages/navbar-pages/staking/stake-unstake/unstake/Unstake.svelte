<script lang="ts">
  import type { Account } from '@stores'
  import StakePanel from '../StakePanel.svelte'
  import OverviewUnstakeCard from '../stake-card/OverviewUnstakeCard.svelte'
  import BigNumber from 'bignumber.js'
  import { getUnstakeManifest } from '../manifests'
  import type { Validator } from '@api/utils/entities/validator'
  import { RET_DECIMAL_PRECISION, XRD_SYMBOL } from '@constants'
  import { formatXRDValue } from '@utils'

  export let stakes: {
    account: Account
    validator: Validator
    amount: string
    stakeUnits: string
  }[]

  const calculateStakeUnitsAmount = (
    xrdAmountToUnstake: string,
    stakeUnitsInAccount: string,
    totalStakeUnits: string,
    totalXrdStaked: string
  ) => {
    const firstPassStakeUnits = new BigNumber(xrdAmountToUnstake)
      .multipliedBy(totalStakeUnits)
      .dividedBy(totalXrdStaked)

    const expectedXrdFromFirstPass = firstPassStakeUnits
      .multipliedBy(totalXrdStaked)
      .dividedBy(totalStakeUnits)

    const one_atto = new BigNumber(1).dividedBy(10 ** 18)

    const secondPassStakeUnits = expectedXrdFromFirstPass.gte(
      xrdAmountToUnstake
    )
      ? firstPassStakeUnits
      : firstPassStakeUnits.plus(one_atto)

    return BigNumber.min(stakeUnitsInAccount, secondPassStakeUnits).toFixed(
      RET_DECIMAL_PRECISION
    )
  }

  let stakeButtonDisabled = false

  let totalUnstakeAmount = '0'

  let invalidInputs = new Array(stakes.length).fill(false)

  $: stakeButtonDisabled = invalidInputs.some((invalid) => invalid)

  let amountsToUnstake = new Array(stakes.length).fill('0')

  $: totalUnstakeAmount = amountsToUnstake
    .reduce<BigNumber>(
      (acc, amount) => acc.plus(amount === '' ? '0' : amount),
      new BigNumber(0)
    )
    .toString()

  const unstake = (
    e: CustomEvent<
      (transactionManifest: string, blobs?: string[] | undefined) => void
    >
  ) => {
    const unstakes: {
      accountAddress: string
      validatorAddress: string
      stakeUnitResource: string
      amount: string
    }[] = []

    stakes.forEach((stake, i) => {
      if (amountsToUnstake[i] !== '0') {
        const stakeUnitsAmount = calculateStakeUnitsAmount(
          amountsToUnstake[i],
          stake.stakeUnits,
          stake.validator.totalStakeUnits,
          stake.validator.totalStakeInXRD
        )

        unstakes.push({
          accountAddress: stake.account.address,
          validatorAddress: stake.validator.address,
          stakeUnitResource: stake.validator.stakeUnitResourceAddress,
          amount: stakeUnitsAmount
        })
      }
    })

    const manifest = getUnstakeManifest(unstakes)

    e.detail(manifest)
  }
</script>

<StakePanel
  {stakeButtonDisabled}
  on:click={unstake}
  sidePanelHeader="Request Unstake"
  on:close
>
  <svelte:fragment slot="heading-text">
    Validator to request unstake from:
  </svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="card-list">
      {#each stakes as stake, i}
        <div class="add-stake-card">
          <OverviewUnstakeCard
            validator={{
              address: stake.validator.address,
              name: stake.validator.metadata.standard.name?.value
            }}
            account={stake.account}
            stakedAmount={stake.amount.toString()}
            bind:amountToUnstake={amountsToUnstake[i]}
            bind:invalid={invalidInputs[i]}
            --token-amount-card-width={rightColumnWidth}
          />
        </div>
      {/each}
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title"
    >How Unstake Requests Works</svelte:fragment
  >

  <svelte:fragment slot="info-box-explanation">
    After you request an unstake, you will receive a claim NFT that you can use
    to claim your XRD after a period of 7 days.
  </svelte:fragment>

  <svelte:fragment slot="summary">
    <div class="summary">
      <div class="summary-title">Total unstaking request ({XRD_SYMBOL})</div>
      <div class="summary-value">
        <!-- This forces it to re-render when invalidInputs changes. For some reason it doesn't re-render otherwise. -->
        {#key invalidInputs}
          {formatXRDValue(totalUnstakeAmount)}
        {/key}
      </div>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="button-text">Send to Radix Wallet</svelte:fragment>
</StakePanel>

<style lang="scss">
  @use '../shared.scss';
  .card-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
</style>
