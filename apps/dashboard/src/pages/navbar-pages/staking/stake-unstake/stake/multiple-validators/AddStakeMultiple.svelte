<script lang="ts">
  import StakePanel from '../../StakePanel.svelte'
  import { selectedValidators } from '../../../Validators.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import OverviewStakeCardMultiple from '../../stake-card/OverviewStakeCardMultiple.svelte'
  import StakeCardMultiple from '../../stake-card/StakeCardMultiple.svelte'
  import DistributeSwitch from './DistributeSwitch.svelte'
  import BigNumber from 'bignumber.js'
  import AccountSection from '../../AccountSection.svelte'
  import { xrdAddress, type Account } from '@stores'
  import { getXRDBalance } from '../getXrdBalance'
  import { getMultipleStakeManifest } from '../../manifests'
  import { removeThousandsSeparator } from '@utils/format-amount'
  import type { ComponentEvents } from 'svelte'
  import { TransactionStatus } from '@common/gateway-sdk'
  import type { ValidatorListItem } from '@api/utils/entities/component/validator'
  import { formatTokenValue } from '@utils'
  import { RET_DECIMAL_PRECISION } from '@constants'

  export let validators: ValidatorListItem[]
  export let currentlyStaked: Promise<{
    [validator: string]: string
  }>

  let xrd: string

  xrdAddress.subscribe((xrdAddress) => {
    xrd = xrdAddress as string
  })

  let stakeButtonDisabled = true

  let totalXRDAmount: string

  let stakeAmounts: {
    validator: string
    amount: string
    preciseAmount: BigNumber
    stakeUnitResourceAddress: string
  }[] = []

  $: stakeAmounts = Array.from({ length: validators.length }, (_, i) => ({
    validator: validators[i].address,
    amount: stakeAmounts[i]?.amount ?? '0',
    preciseAmount: stakeAmounts[i]?.preciseAmount ?? BigNumber(0),
    stakeUnitResourceAddress: validators[i].stakeUnitResourceAddress
  }))

  let distributeEqually = true

  $: if (distributeEqually) {
    const singleValidatorValue = new BigNumber(totalXRDAmount)
      .dividedBy(validators.length)
      .decimalPlaces(RET_DECIMAL_PRECISION)
    stakeAmounts = stakeAmounts.map((stake) => ({
      stakeUnitResourceAddress: stake.stakeUnitResourceAddress,
      validator: stake.validator,
      preciseAmount: totalXRDAmount ? singleValidatorValue : new BigNumber(0),
      amount: totalXRDAmount
        ? formatTokenValue(singleValidatorValue).displayValue
        : '0'
    }))
  } else {
    const aggregatedValue = new BigNumber(
      stakeAmounts.reduce(
        (acc, stake) => acc.plus(stake.preciseAmount ?? new BigNumber(0)),
        new BigNumber(0)
      )
    )
    totalXRDAmount = aggregatedValue.toFixed()
  }

  let tokenAmountInvalid = false

  $: stakeButtonDisabled =
    stakeAmounts.every((stake) => new BigNumber(stake.amount).lte(0)) ||
    tokenAmountInvalid

  let selectedAccount: Account

  let xrdBalance: Promise<string> = new Promise(() => {})

  $: if (selectedAccount) {
    xrdBalance = getXRDBalance(selectedAccount.address)
  }

  const handleStakeInput =
    (i: number) => (e: ComponentEvents<StakeCardMultiple>['input']) => {
      stakeAmounts[i].amount = removeThousandsSeparator(e.detail)
      stakeAmounts[i].preciseAmount = new BigNumber(stakeAmounts[i].amount)
    }

  const removeValidator = (i: number) => {
    validators = validators.filter((_, index) => index !== i)
    $selectedValidators[stakeAmounts[i].validator] = false
  }
</script>

<StakePanel
  useBackdrop
  learnMoreUrl="https://learn.radixdlt.com/article/how-should-i-choose-validators-to-stake-to"
  sidePanelHeader="Add Stake"
  {stakeButtonDisabled}
  on:click={(e) => {
    const manifest = getMultipleStakeManifest(
      selectedAccount.address,
      stakeAmounts,
      xrd
    )

    e.detail(manifest)
  }}
  on:close
  on:tx-response={({ detail: { status } }) => {
    if (status === TransactionStatus.CommittedSuccess) {
      $selectedValidators = {}
    }
  }}
>
  <svelte:fragment slot="account-picker">
    <AccountSection bind:selectedAccount />
  </svelte:fragment>

  <svelte:fragment slot="heading-text">Total staking amount</svelte:fragment>

  <svelte:fragment slot="content">
    <OverviewStakeCardMultiple
      {xrdBalance}
      nbrOfValidators={validators.length}
      bind:amountToStake={totalXRDAmount}
      bind:tokenAmountInvalid
      tokenAmountDisabled={!distributeEqually}
    />

    <Divider />

    <DistributeSwitch bind:on={distributeEqually} />

    <div class="validator-card">
      {#each validators as validator, i}
        <StakeCardMultiple
          {validator}
          tokenAmount={stakeAmounts[i].amount}
          amountCardDisabled={distributeEqually}
          currentlyStakingAmount={currentlyStaked.then(
            (staked) => staked[validator.address]
          )}
          on:input={handleStakeInput(i)}
          on:remove={() => removeValidator(i)}
        />
      {/each}
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Staking Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    Stake XRD to validators that you trust to reliably validate transactions on
    the Radix Network. If they maintain their performance, you can share in the
    XRD emissions rewards that result.
  </svelte:fragment>
</StakePanel>

<style lang="scss">
  .validator-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
  }
</style>
