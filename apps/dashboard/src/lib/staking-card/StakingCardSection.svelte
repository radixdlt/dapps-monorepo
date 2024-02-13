<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { formatXRDValue } from '@utils'
  import BigNumber from 'bignumber.js'

  export let icon: string
  export let titleText: string
  export let amount: BigNumber | Promise<BigNumber | string> | string

  $: amountResolved = Promise.resolve(amount).then((value) =>
    typeof value === 'string' ? BigNumber(value) : value
  )
</script>

<div class="stake-display">
  <div class="text-with-icon">
    <IconNew {icon} --size="1.5rem" />
    <div class="title-text">{titleText}</div>
  </div>
  <div class="amount-text">
    {#await amountResolved}
      <SkeletonLoader />
    {:then amount}
      {formatXRDValue(amount)}
    {/await}
  </div>
  <slot />
</div>

<style lang="scss">
  .text-with-icon {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--spacing-sm);
  }

  .title-text {
    @extend .dotted-overflow;
    font-weight: var(--font-weight-bold-1);
    color: var(--color-grey-2);
  }

  .amount-text {
    @extend .dotted-overflow;
    font-weight: var(--font-weight-bold-3);
    font-size: var(--text-2xl);
  }

  .stake-display {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
</style>
