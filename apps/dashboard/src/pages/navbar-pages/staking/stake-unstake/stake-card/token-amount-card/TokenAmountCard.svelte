<script lang="ts">
  import Account from '@components/_base/account/Account.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import AmountInput from '@components/_base/input/AmountInput.svelte'
  import type { Account as AccountT } from '@stores'
  import { createEventDispatcher } from 'svelte'

  export let token: {
    name: string
    iconUrl: string
  }
  export let account: AccountT | undefined = undefined
  export let tokenAmount = '0'
  export let invalid = false
  export let disabled = false
  export let readonly: boolean = false

  let hasEnoughBalance = true

  $: invalid = !hasEnoughBalance

  const dispatch = createEventDispatcher<{ input: string }>()
</script>

<div class="wrapper">
  {#if account}
    <div class="account">
      <Account {account} />
    </div>
  {/if}

  {#if $$slots.header}
    <div
      class="slot-content header"
      class:disabled
      style:background={`${
        invalid ? 'var(--invalid-background-color)' : 'var(--theme-surface-1)'
      }`}
      style:border-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
    >
      <div class="content">
        <slot name="header" />
      </div>
    </div>
  {/if}

  <div
    class="token-amount-card"
    class:disabled
    style:background={`${
      invalid ? 'var(--invalid-background-color)' : 'var(--theme-surface-1)'
    }`}
    style:border-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
    style:border-radius={`
      ${account ? '0' : 'var(--card-border-radius)'}
      ${account ? '0' : 'var(--card-border-radius)'}
      ${$$slots.footer ? '0' : 'var(--card-border-radius)'}
      ${$$slots.footer ? '0' : 'var(--card-border-radius)'}
    `}
    style:border-top={`${account ? 'none' : 'var(--border) var(-theme-border'}`}
    style:border-bottom={`${
      $$slots.footer ? 'none' : 'var(--border) var(--theme-border)'
    }`}
  >
    <div class="token-amount">
      <div class="name">
        <IconNew icon={token.iconUrl} --size="1.5rem" />
        {token.name}
      </div>

      <AmountInput
        value={tokenAmount}
        on:input={(e) => {
          tokenAmount = e.detail.value
          dispatch('input', tokenAmount)
        }}
        {readonly}
        --text-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
      />
    </div>
  </div>

  {#if $$slots.footer}
    <div
      class="slot-content footer"
      class:disabled
      style:background={`${
        invalid ? 'var(--invalid-background-color)' : 'var(--theme-surface-1)'
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
  @use './shared.scss';

  .wrapper {
    min-width: var(--card-width);
    max-width: var(--card-width);
    justify-self: end;
  }

  .token-amount-card {
    padding: var(--card-padding-top-bottom) var(--card-padding-left-right);
    border-radius: var(--card-border-radius);
    border: var(--border) var(--theme-border);

    .token-amount {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-lg);
      padding: var(--spacing-md) 0;

      .name {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        font-weight: var(--font-weight-bold-2);
      }
    }
  }

  .account {
    :global(.option) {
      border-radius: var(--card-border-radius) var(--card-border-radius) 0 0;
      border: var(--border) var(--theme-border);
      border-bottom: none;
    }
  }

  .slot-content {
    background-color: var(--surface);
    padding: 0 var(--card-padding-left-right);

    .content {
      padding: var(--spacing-lg) 0;
    }
  }

  .header {
    border: var(--border) var(--theme-border);
    border-bottom: none;
    border-top: none;

    .content {
      padding-bottom: 0;
    }
  }

  .footer {
    border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
    border: var(--border) var(--theme-border);
    border-top: none;
  }
</style>
