<script lang="ts">
  import StakePanel from '../StakePanel.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import TokenAmountCard from '../stake-card/token-amount-card/TokenAmountCard.svelte'
  import { formatTokenValue } from '@utils'
  import BigNumber from 'bignumber.js'
  import type { Account } from '@stores'
  import { XRDToken } from '@constants'
  import type { Validator } from '../../Validators.svelte'
  import { getClaimManifest } from '../manifests'

  export let open: boolean
  export let readyToClaim: {
    validator: Validator
    amount: string
    account: Account
  }[]

  let totalClaimAmount = '0'

  $: totalClaimAmount = readyToClaim
    .reduce<BigNumber>(
      (acc, claim) => acc.plus(claim.amount === '' ? '0' : claim.amount),
      new BigNumber(0)
    )
    .toString()

  const claim = (
    e: CustomEvent<
      (transactionManifest: string, blobs?: string[] | undefined) => void
    >
  ) => {
    e.detail(
      getClaimManifest(
        readyToClaim.map((claim) => ({
          ...claim,
          accountAddress: claim.account.address,
          validatorAddress: claim.validator.address,
          stakeUnitResource: claim.validator.stakeUnitResourceAddress
        }))
      )
    )
  }
</script>

<StakePanel bind:open on:click={claim}>
  <svelte:fragment slot="title">Claim</svelte:fragment>

  <svelte:fragment slot="heading-text">Claim your XRD tokens</svelte:fragment>

  <svelte:fragment slot="heading-subtext">Ready to claim</svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="card-list">
      {#each readyToClaim as { validator, amount, account }}
        <div class="validator-card">
          <div class="validator">
            <div class="dotted-overflow">
              {validator.name}
            </div>
            <div>
              <Address value={validator.address} short useBackground={false} />
            </div>
          </div>
          <TokenAmountCard
            token={XRDToken}
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
