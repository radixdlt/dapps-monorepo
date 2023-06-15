<script lang="ts">
  import type { Account as AccountT } from '@stores'

  import Account from '@components/_base/account/Account.svelte'
  import TokenAmountCardWithUndertext from './TokenAmountCardWithUndertext.svelte'
  import BigNumber from 'bignumber.js'

  export let token: {
    name: string
    iconUrl: string
  }
  export let stake: {
    account: AccountT
    amount: string
  }
  export let amount = '0'
  export let tokenDisplayedAmount: string = ''
  export let invalid = false
  export let disabled = false

  $: invalid = new BigNumber(stake.amount).lt(new BigNumber(amount))
</script>

<div class="token-amount-card">
  <div class="account">
    <Account account={stake.account} />
  </div>
  <TokenAmountCardWithUndertext
    {token}
    bind:tokenDisplayedAmount
    bind:tokenAmount={amount}
    bind:invalid
    bind:disabled
  >
    <div slot="undertext" class="subtext">
      Staked {stake.amount}
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
