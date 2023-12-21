<script lang="ts">
  import StakePanel from '../StakePanel.svelte'
  import TokenAmountCard from '../stake-card/token-amount-card/TokenAmountCard.svelte'
  import { formatTokenValue } from '@utils'
  import BigNumber from 'bignumber.js'
  import type { Account } from '@stores'
  import { XRDToken } from '@constants'
  import { getClaimManifest } from '../manifests'
  import StakeCard from '../stake-card/StakeCard.svelte'
  import ValidatorInfo from '../stake-card/ValidatorInfo.svelte'
  import type { ClaimNft } from '@api/_deprecated/utils/nfts/claim-nft'
  import type { ValidatorListItem } from '@api/utils/entities/component/validator'
  import { track } from '@dashboard/routes/+layout.svelte'

  export let readyToClaim: {
    validator: ValidatorListItem
    xrdAmount: string
    account: Account
    claimNft: ClaimNft
  }[]
  export let useBackdrop: boolean = false

  $: accumulatedClaims = readyToClaim.reduce((acc, claim) => {
    const existingClaimIndex = acc.findIndex(
      (c) =>
        c.validator.address === claim.validator.address &&
        c.account === claim.account
    )

    if (existingClaimIndex >= 0) {
      acc[existingClaimIndex].xrdAmount = new BigNumber(
        acc[existingClaimIndex].xrdAmount
      )
        .plus(claim.xrdAmount)
        .toString()

      return acc
    } else {
      return [...acc, { ...claim }]
    }
  }, [] as typeof readyToClaim)

  let totalClaimAmount = '0'

  $: totalClaimAmount = accumulatedClaims
    .reduce<BigNumber>(
      (acc, claim) => acc.plus(claim.xrdAmount === '' ? '0' : claim.xrdAmount),
      new BigNumber(0)
    )
    .toString()

  const claim = (
    e: CustomEvent<
      (transactionManifest: string, blobs?: string[] | undefined) => void
    >
  ) => {
    track('click:send-tx-claim')
    e.detail(
      getClaimManifest(
        readyToClaim.map((claim) => ({
          id: claim.claimNft.id,
          accountAddress: claim.account.address,
          validatorAddress: claim.validator.address,
          unstakeClaimResource: claim.validator.unstakeClaimResourceAddress
        }))
      )
    )
  }
</script>

<StakePanel {useBackdrop} on:click={claim} sidePanelHeader="Claim" on:close>
  <svelte:fragment slot="heading-text"
    >Claim{accumulatedClaims.length > 1 ? 's' : ''} to redeem:</svelte:fragment
  >

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="card-list">
      {#each accumulatedClaims as { validator, xrdAmount, account }}
        <StakeCard>
          <svelte:fragment slot="info">
            <ValidatorInfo
              name={validator.metadata.expected.name?.typed.value}
              {...validator}
            />
          </svelte:fragment>

          <svelte:fragment slot="token-amount-card">
            <TokenAmountCard
              token={XRDToken}
              {account}
              tokenAmount={xrdAmount}
              readonly={true}
              --card-width={rightColumnWidth}
            />
          </svelte:fragment>
        </StakeCard>
      {/each}
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Stake Claims Work</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    Your claim NFT will be returned to the validator in exchange for the
    quantity of XRD that you requested to unstake.
  </svelte:fragment>

  <svelte:fragment slot="summary">
    <div class="summary">
      <div class="summary-title">You're claiming a total</div>
      <div class="summary-value">
        {formatTokenValue(totalClaimAmount).displayValue} XRD
      </div>
    </div>
  </svelte:fragment>
</StakePanel>

<style lang="scss">
  @use '../shared.scss';

  .card-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
</style>
