<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import StakePanel from '../StakePanel.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import type ValidatorInfo from '../stake-card/ValidatorInfo.svelte'
  import TokenAmountCard from '../stake-card/token-amount-card/TokenAmountCard.svelte'
  import { formatTokenValue } from '@utils'
  import BigNumber from 'bignumber.js'

  export let open: boolean
  export let availableToClaim: {
    validator: Omit<ComponentProps<ValidatorInfo>, 'currentlyStakingAmount'>
    amount: string
  }[]
  export let token: ComponentProps<TokenAmountCard>['token']
  export let account: ComponentProps<TokenAmountCard>['account']

  let totalClaimAmount = '0'

  $: totalClaimAmount = availableToClaim
    .reduce<BigNumber>(
      (acc, claim) => acc.plus(claim.amount === '' ? '0' : claim.amount),
      new BigNumber(0)
    )
    .toString()
</script>

<StakePanel {open}>
  <svelte:fragment slot="title">Claim</svelte:fragment>

  <svelte:fragment slot="heading-text">Claim your XRD tokens</svelte:fragment>

  <svelte:fragment slot="heading-subtext">Ready to claim</svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="card-list">
      {#each availableToClaim as { validator, amount }}
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
          <TokenAmountCard
            {token}
            {account}
            tokenAmount={amount}
            tokenDisplayedAmount={amount}
            readonly={true}
            --width={rightColumnWidth}
          />
        </div>
      {/each}
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Claiming Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    Once you claim the XRD will appear in your wallet.
  </svelte:fragment>

  <svelte:fragment slot="summary">
    <div class="summary">
      <div class="summary-title">You're claiming a total</div>
      <div class="summary-value">
        {formatTokenValue(totalClaimAmount).value} XRD
      </div>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="button-text">Claim</svelte:fragment>
</StakePanel>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';
  @use '../shared.scss';

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

  .card-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
</style>
