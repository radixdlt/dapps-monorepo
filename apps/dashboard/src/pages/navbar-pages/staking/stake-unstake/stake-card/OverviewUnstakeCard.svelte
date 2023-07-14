<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakeCard from './StakeCard.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import type { Account } from '@stores'
  import UnstakeIcon from '@icons/unstaking.svg'
  import TokenAmountCard from './token-amount-card/TokenAmountCard.svelte'
  import BigNumber from 'bignumber.js'
  import { formatTokenValue } from '@utils'
  import { XRDToken } from '@constants'

  export let amountToUnstake: string = '0'
  export let validator: {
    name: string
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
    amountToUnstake = stakedAmount
  }
</script>

<StakeCard>
  <svelte:fragment slot="icon">
    <IconNew icon={UnstakeIcon} --size="4rem" />
  </svelte:fragment>

  <div class="info" slot="info">
    <div class="validator-name dotted-overflow">
      {validator.name}
    </div>

    <Address value={validator.address} short />
  </div>

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCard
      token={XRDToken}
      {account}
      bind:tokenAmount={amountToUnstake}
      bind:invalid
    >
      <div slot="footer" class:invalid class="footer">
        <div class="subtext">
          Staked {formatTokenValue(stakedAmount).value}
        </div>
        <button class="max-button subtext" on:click={() => setMax()}>Max</button
        >
      </div>
    </TokenAmountCard>
  </svelte:fragment>
</StakeCard>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .validator-name {
    font-size: var(--text-lg);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

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
  }
</style>
