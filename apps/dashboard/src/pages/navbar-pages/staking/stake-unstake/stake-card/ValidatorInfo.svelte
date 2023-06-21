<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import { formatTokenValue } from '@utils'

  export let validatorName: string
  export let validatorAddress: string
  export let currentlyStakingAmount: string | undefined = undefined
</script>

<div class="staking-info">
  <div class="validator-name dotted-overflow">
    {validatorName}
  </div>
  <div>
    <Address value={validatorAddress} short useBackground={false} />
  </div>
  {#if currentlyStakingAmount}
    <div class="currently-staking dotted-overflow">
      Currently staking: {formatTokenValue(currentlyStakingAmount).value} XRD
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
