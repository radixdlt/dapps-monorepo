<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Address from '@components/_base/address/Address.svelte'
  import { formatTokenValue } from '@utils'

  export let name: string | undefined = undefined
  export let address: string
  export let currentlyStakingAmount: Promise<string | undefined> | undefined =
    undefined
</script>

<div class="staking-info">
  <div class="validator-name dotted-overflow">
    {name || ''}
  </div>
  <div>
    <Address --background="var(--theme-surface-3)" value={address} short />
  </div>
  {#if currentlyStakingAmount}
    <div class="currently-staking dotted-overflow">
      Currently staked:
      {#await currentlyStakingAmount}
        <SkeletonLoader width={100} />
      {:then amount}
        {formatTokenValue(amount ?? '0').displayValue} XRD
      {/await}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .staking-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);

    .validator-name {
      font-size: var(--text-lg);
    }

    .currently-staking {
      color: var(--theme-subtext);
      display: flex;
      gap: var(--spacing-md);
    }
  }
</style>
