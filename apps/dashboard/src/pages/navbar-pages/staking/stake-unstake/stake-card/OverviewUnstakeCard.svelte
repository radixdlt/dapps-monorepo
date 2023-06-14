<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakeCard from './StakeCard.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import TokenAmountCardWithAccount from './token-amount-card/TokenAmountCardWithAccount.svelte'
  import type { ComponentProps } from 'svelte'

  export let amountToUnstake: string
  export let validator: {
    name: string
    address: string
  }
  export let tokenCardProps: Omit<
    ComponentProps<TokenAmountCardWithAccount>,
    'amount' | 'tokenDisplayedAmount' | 'invalid' | 'disabled'
  >
  export let invalid: boolean
</script>

<StakeCard>
  <svelte:fragment slot="icon">
    <IconNew type="unstaking" --size="4rem" />
  </svelte:fragment>

  <div class="info" slot="info">
    <div class="validator-name dotted-overflow">
      Unstaking from {validator.name}
    </div>
    <div>
      <Address value={validator.address} short useBackground={false} />
    </div>
  </div>

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCardWithAccount
      {...tokenCardProps}
      bind:amount={amountToUnstake}
      bind:invalid
    />
  </svelte:fragment>
</StakeCard>

<style lang="scss">
  @use '../../../../../mixins.scss';

  .validator-name {
    font-size: var(--text-lg);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
