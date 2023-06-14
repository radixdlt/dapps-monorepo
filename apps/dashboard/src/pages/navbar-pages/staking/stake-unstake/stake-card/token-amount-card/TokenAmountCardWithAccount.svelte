<script lang="ts">
  import Account from '@components/_base/account/Account.svelte'
  import type { Account as AccountT } from '@stores'
  import TokenAmountCardWithUndertext from './TokenAmountCardWithUndertext.svelte'
  import BigNumber from 'bignumber.js'

  export let token: {
    name: string
    iconUrl: string
  }
  export let amount: string
  export let tokenDisplayedAmount: string = ''
  export let invalid = false
  export let disabled = false
  export let account: AccountT
  export let stakedAmount: string

  $: invalid = new BigNumber(stakedAmount).lt(new BigNumber(amount))
</script>

<div class="token-amount-card">
  <div class="account">
    <Account {account} />
  </div>
  <TokenAmountCardWithUndertext
    {token}
    bind:tokenDisplayedAmount
    bind:tokenAmount={amount}
    bind:invalid
    bind:disabled
  >
    <div slot="undertext" class="subtext">
      Staked {stakedAmount}
    </div>
  </TokenAmountCardWithUndertext>
</div>

<style lang="scss">
  @use '../../../../../../mixins.scss';
  @use './shared.scss';

  .token-amount-card {
    :global(.token-amount-card) {
      border-radius: 0;
      border-top: none;
    }
  }

  .account {
    :global(.option) {
      border-radius: var(--card-border-radius) var(--card-border-radius) 0 0;
      border: var(--border);
      border-bottom: none;
    }
  }
</style>
