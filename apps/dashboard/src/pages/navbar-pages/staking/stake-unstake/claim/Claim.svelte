<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import StakePanel from '../StakePanel.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import type ValidatorInfo from '../stake-card/ValidatorInfo.svelte'
  import TokenAmountCard from '../stake-card/token-amount-card/TokenAmountCard.svelte'

  export let open: boolean

  export let validator: ComponentProps<ValidatorInfo>
  export let token: ComponentProps<TokenAmountCard>['token']
  export let account: ComponentProps<TokenAmountCard>['account']
</script>

<StakePanel {open}>
  <svelte:fragment slot="title">Claim</svelte:fragment>

  <svelte:fragment slot="heading-text">Claim your XRD tokens</svelte:fragment>

  <svelte:fragment slot="heading-subtext">Ready to claim</svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="validator-card">
      <div class="validator">
        <div class="dotted-overflow">
          {validator.validatorName}
        </div>
        <div>
          <Address
            value={validator.validatorAddress}
            short
            useBackground={false}
          />
        </div>
      </div>
      <TokenAmountCard {token} {account} --width={rightColumnWidth} />
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Claiming Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    Once you claim the XRD will appear in your wallet.
  </svelte:fragment>

  <svelte:fragment slot="button-text">Claim</svelte:fragment>
</StakePanel>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .validator-card {
    @include mixins.card;
    padding: var(--spacing-lg);
    display: grid;
    grid: 1fr / 1fr 25rem;
    align-items: center;

    .validator {
      margin-left: var(--spacing-lg);
    }
  }
</style>
