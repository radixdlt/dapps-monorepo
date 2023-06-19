<script lang="ts">
  import Account from '@components/_base/account/Account.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import AmountInput from '@components/_base/input/AmountInput.svelte'
  import type { Account as AccountT } from '@stores'

  export let token: {
    name: string
    iconUrl: string
  }
  export let account: AccountT | undefined = undefined
  export let tokenAmount = '0'
  export let tokenDisplayedAmount: string = '0'
  export let invalid = false
  export let disabled = false
  export let readonly: boolean = false

  let hasEnoughBalance = true

  $: invalid = !hasEnoughBalance
</script>

<div>
  {#if account}
    <div class="account">
      <Account {account} />
    </div>
  {/if}

  <div
    class="token-amount-card"
    class:disabled
    style:background={`${
      invalid ? 'var(--invalid-background-color)' : 'var(--surface)'
    }`}
    style:border-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
    style:border-radius={`
      ${account ? '0' : 'var(--card-border-radius)'}
      ${account ? '0' : 'var(--card-border-radius)'}
      ${$$slots.footer ? '0' : 'var(--card-border-radius)'}
      ${$$slots.footer ? '0' : 'var(--card-border-radius)'}
    `}
    style:border-top={`${account ? 'none' : 'var(--border)'}`}
    style:border-bottom={`${$$slots.footer ? 'none' : 'var(--border)'}`}
  >
    <div class="token-amount">
      <div class="name">
        <img src={token.iconUrl} alt="bitcoin" />
        {token.name}
      </div>

      <AmountInput
        bind:displayedValue={tokenDisplayedAmount}
        bind:value={tokenAmount}
        {readonly}
        --width="14rem"
        --text-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
      />
    </div>
  </div>

  {#if $$slots.footer}
    <div
      class="footer"
      class:disabled
      style:background={`${
        invalid ? 'var(--invalid-background-color)' : 'var(--surface)'
      }`}
      style:border-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
    >
      <Divider
        --spacing="none"
        --color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
      />
      <div class="content">
        <slot name="footer" />
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../../../../../../../packages/ui/src/mixins.scss';
  @use './shared.scss';

  .token-amount-card {
    padding: var(--card-padding-top-bottom) var(--card-padding-left-right);
    border-radius: var(--card-border-radius);
    border: var(--border);

    .token-amount {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-lg);

      .name {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-weight: var(--font-weight-bold-2);

        img {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }

  .account {
    :global(.option) {
      border-radius: var(--card-border-radius) var(--card-border-radius) 0 0;
      border: var(--border);
      border-bottom: none;
    }
  }

  .footer {
    background-color: var(--surface);
    padding: 0 var(--card-padding-left-right);
    border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
    border: var(--border);
    border-top: none;

    .content {
      padding: var(--spacing-sm) 0;
    }
  }
</style>