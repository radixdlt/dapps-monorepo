<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'

  export let validatorName: string
  export let validatorAddress: string
  export let currentlyStakingAmount: string
</script>

<div class="staking-info">
  <div class="validator-name dotted-overflow">
    Staking to {validatorName}
  </div>
  <div>
    <Address value={validatorAddress} short useBackground={false} />
  </div>
  <div class="currently-staking dotted-overflow">
    Currently staking: {currentlyStakingAmount} XRD
  </div>
</div>

<style lang="scss">
  @use '../../../../../mixins.scss';

  .staking-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    .validator-name {
      font-size: var(--text-lg);
    }

    .currently-staking {
      margin-top: var(--spacing-sm);
      color: var(--subtext-color);
    }
  }
</style>
