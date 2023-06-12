<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import TokenAmountCard from './TokenAmountCard.svelte'

  export let validatorName: string
  export let validatorAddress: string
  export let currentlyStakingAmount: string
  export let xrdBalance: string

  let tokenAmount: string
</script>

<div class="add-stake-card">
  <div class="icon">
    <IconNew type="staking" --size="4rem" />
  </div>

  <div class="staking-info">
    <div class="dotted-overflow">
      Staking to {validatorName}
    </div>
    <div>
      <Address value={validatorAddress} short useBackground={false} />
    </div>
    <div class="subtext">
      Currently staking: {currentlyStakingAmount} XRD
    </div>
  </div>

  <TokenAmountCard
    on:invalid
    tokenName="XRD"
    tokenBalance={xrdBalance}
    iconUrl=""
    bind:tokenAmount
  />
</div>

<style lang="scss">
  @use '../../../../mixins.scss';

  .add-stake-card {
    @include mixins.card;
    padding: var(--spacing-lg);
    display: grid;
    grid-template-columns: 5rem minmax(0, 1fr) var(
        --token-amount-card-width,
        1fr
      );
    gap: var(--spacing-lg);
    align-items: center;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .staking-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
</style>
