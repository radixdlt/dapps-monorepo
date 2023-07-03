<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import { formatAmount, formatTokenValue } from '@utils'
  import ExtendedStakingCard from './ExtendedStakingCard.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import CloseButton from '@components/_base/side-panel/CloseButton.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { connected } from '@stores'
  import type { AccumulatedStakes } from '../../../../routes/(navbar-pages)/validators/proxy+layout'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Link from '@components/_base/link/Link.svelte'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import BookmarkValidator from '../bookmark-validator/BookmarkValidator.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import type { Validator } from '../Validators.svelte'

  export let open: boolean
  export let validator: Promise<Validator>
  export let accumulatedValidatorStakes: Promise<AccumulatedStakes>
</script>

<SidePanel bind:open>
  <div id="top-row">
    <CloseButton on:click={() => (open = false)} />
    <h3>Validator</h3>
    <div id="bookmarked">
      <BookmarkValidator {validator} withText />
    </div>
  </div>
  <Divider />
  {#await validator}
    <SkeletonLoader />
  {:then validator}
    <h1>{validator.name}</h1>
  {/await}
  <div class="subheader">
    {#await validator}
      <SkeletonLoader />
    {:then { address }}
      <Address
        value={address}
        short
        useBackground
        --background="var(--theme-surface-3)"
      />
    {/await}
    <SelectValidator {validator} text="SELECT VALIDATOR" />
  </div>

  {#if $connected}
    <div>
      <ExtendedStakingCard
        staked={validator.then((v) =>
          accumulatedValidatorStakes.then(
            (accum) => accum[v.address].accumulatedStakes
          )
        )}
        unstaking={validator.then((v) =>
          accumulatedValidatorStakes.then(
            (accum) => accum[v.address].accumulatedUnstaking
          )
        )}
        readyToClaim={validator.then((v) =>
          accumulatedValidatorStakes.then(
            (accum) => accum[v.address].accumulatedReadyToClaim
          )
        )}
        claimText="Claim"
        validatorAddress={validator.then((v) => v.address)}
        on:add-stake
        on:unstake
        on:claim
      />
    </div>
    <Divider />
  {/if}

  <div class="surface-2">
    <InfoBox header="Validator Details" --background="var(--theme-surface-1)">
      <AwaitedRow
        text="Address"
        promise={validator.then(({ address }) => address)}
        let:data
      >
        <Address value={data} />
      </AwaitedRow>
      <AwaitedRow
        text="Owner address"
        promise={validator.then(({ ownerAddress }) => ownerAddress)}
        let:data
      >
        <Address value={data} />
      </AwaitedRow>
      <AwaitedRow
        text="Website"
        promise={validator.then(({ website }) => website)}
        let:data
      >
        <Link url={data} external />
      </AwaitedRow>
      <AwaitedRow text="Total Stake" promise={validator} let:data>
        <div>
          <span>{formatTokenValue(data.totalStake).value} XRD</span>
          <span>({data.percentageTotalStake.toFixed(1)}%)</span>
        </div>
      </AwaitedRow>
      <AwaitedRow text="Owner Stake" promise={validator} let:data>
        <div>
          <span>{formatTokenValue(data.ownerStake).value} XRD</span>
          <span>({data.percentageOwnerStake.toFixed(1)}%)</span>
        </div>
      </AwaitedRow>
      <AwaitedRow
        text="Fee (%)"
        promise={validator.then(({ fee }) => fee)}
        let:data
      >
        {formatAmount(data)}
      </AwaitedRow>
      <AwaitedRow
        text="Apy"
        promise={validator.then(({ apy }) => apy)}
        let:data
      >
        {formatAmount(data)}
      </AwaitedRow>
      <AwaitedRow
        text="Server Provider"
        promise={validator.then(({ uptime }) => uptime)}
        let:data
      >
        N/A ({formatAmount(data)}%)
      </AwaitedRow>
      <Row text="Accepts Stake">
        <AcceptsStake
          slot="right"
          value={validator.then(({ acceptsStake }) => acceptsStake)}
        />
      </Row>
      <Row text="Registration Status">
        <span slot="right">N/A</span>
      </Row>
    </InfoBox>
  </div>
</SidePanel>

<style lang="scss">
  @use '../../../../../../../packages/ui/src/mixins.scss';

  .surface-2 {
    @include mixins.card();
  }

  #top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    #bookmarked {
      justify-self: end;
    }
  }

  .subheader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }
</style>
