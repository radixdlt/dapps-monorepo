<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakeCard from './StakeCard.svelte'
  import type { Account } from '@stores'
  import UnstakeIcon from '@icons/unstaking.svg'
  import TokenAmountCard from './token-amount-card/TokenAmountCard.svelte'
  import BigNumber from 'bignumber.js'
  import { formatXRDValue } from '@utils'
  import { XRDToken } from '@constants'
  import ValidatorInfo from './ValidatorInfo.svelte'

  export let amountToUnstake: string = '0'
  export let validator: {
    name?: string
    address: string
  }
  export let invalid: boolean
  export let account: Account
  export let stakedAmount: string

  let validUnstakeAmount: boolean

  $: validUnstakeAmount = new BigNumber(stakedAmount).gte(
    new BigNumber(amountToUnstake)
  )

  $: invalid = !validUnstakeAmount

  const setMax = () => {
    amountToUnstake = new BigNumber(stakedAmount).toFixed()
  }
</script>

<StakeCard>
  <svelte:fragment slot="icon">
    <IconNew icon={UnstakeIcon} --size="3rem" />
  </svelte:fragment>

  <svelte:fragment slot="info">
    <ValidatorInfo {...validator} />
  </svelte:fragment>

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCard
      token={XRDToken}
      {account}
      bind:tokenAmount={amountToUnstake}
      bind:invalid
    >
      <div slot="header" class="subtext">Liquid Stake Units worth:</div>
      <div slot="footer" class:invalid class="footer">
        <div class="subtext dotted-overflow">
          Current staked value: {formatXRDValue(stakedAmount)}
        </div>
        <button class="max-button subtext" on:click={() => setMax()}>Max</button
        >
      </div>
    </TokenAmountCard>
  </svelte:fragment>
</StakeCard>

<style lang="scss">
  .invalid {
    color: var(--invalid-border-color);
  }

  .max-button {
    color: var(--theme-button-primary);
  }

  .footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    justify-content: space-between;
  }
</style>
