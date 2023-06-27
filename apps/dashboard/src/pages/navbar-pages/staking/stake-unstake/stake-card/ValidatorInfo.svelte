<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Address from '@components/_base/address/Address.svelte'
  import { formatTokenValue } from '@utils'

  export let name: string
  export let address: string
  export let currentlyStakingAmount: Promise<string> | undefined = undefined
</script>

<div class="staking-info">
  <div class="validator-name dotted-overflow">
    {name}
  </div>
  <div>
    <Address value={address} short useBackground={false} />
  </div>
  {#if currentlyStakingAmount}
    <div class="currently-staking dotted-overflow">
      Currently staking:
      {#await currentlyStakingAmount}
        <SkeletonLoader />
      {:then amount}
        {formatTokenValue(amount).value} XRD
      {/await}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .staking-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    .validator-name {
      font-size: var(--text-lg);
    }

    .currently-staking {
      margin-top: var(--spacing-sm);
      color: var(--theme-subtext);
    }
  }
</style>
