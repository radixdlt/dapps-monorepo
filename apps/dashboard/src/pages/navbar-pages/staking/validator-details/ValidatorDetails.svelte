<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import { formatTokenValue, formatXRDValue } from '@utils'
  import ExtendedStakingCard from './ExtendedStakingCard.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { connected } from '@stores'
  import type { AccumulatedStakes } from '../../../../routes/(navbar-pages)/network-staking/proxy+layout'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Link from '@components/_base/link/Link.svelte'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import BookmarkValidator from '../bookmark-validator/BookmarkValidator.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import type { Validator } from '../Validators.svelte'
  import { createEventDispatcher } from 'svelte'

  export let validator: Promise<Validator>
  export let accumulatedValidatorStakes: Promise<AccumulatedStakes>

  const dispatch = createEventDispatcher<{
    close: null
  }>()
</script>

<SidePanel useBackdrop on:close>
  <SidePanelHeader text="Validator" on:closeClick={() => dispatch('close')}>
    <BookmarkValidator {validator} withText />
  </SidePanelHeader>

  <div class="validator-name">
    {#await validator}
      <SkeletonLoader />
    {:then validator}
      <h1 class="dotted-overflow">{validator.name}</h1>
    {/await}
    <SelectValidator {validator} text="SELECT VALIDATOR" />
  </div>
  <div class="subheader">
    {#await validator}
      <SkeletonLoader />
    {:then { address }}
      <Address value={address} --background="var(--theme-surface-3)" />
    {/await}
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

  <div class="card">
    <InfoBox header="Validator Details" --background="var(--theme-surface-1)">
      <AwaitedRow
        text="Owner address"
        promise={validator.then(({ ownerAddress }) => ownerAddress)}
        let:data
      >
        <Address short value={data} />
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
          <span>{formatXRDValue(data.totalStakeInXRD)}</span>
          <span>({data.percentageTotalStake.toFixed(1)}%)</span>
        </div>
      </AwaitedRow>
      <AwaitedRow text="Owner Stake" promise={validator} let:data>
        <div>
          <span>{formatXRDValue(data.ownerStake)}</span>
          <span>({data.percentageOwnerStake.toFixed(1)}%)</span>
        </div>
      </AwaitedRow>
      <AwaitedRow
        text="Fee (%)"
        promise={validator.then(({ fee }) => fee)}
        let:data
      >
        {formatTokenValue(data).displayValue}
      </AwaitedRow>
      <AwaitedRow
        text="Apy"
        promise={validator.then(({ apy }) => apy)}
        let:data
      >
        {formatTokenValue(data).displayValue}
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
  .validator-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .subheader {
    margin-bottom: var(--spacing-xl);
  }
</style>
