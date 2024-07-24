<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import StakeDisplay from './StakeDisplay.svelte'
  import { formatXRDValue, truncateNumber } from '@utils'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import { connected } from '@stores'
  import type { UptimeValue } from './UptimeHeader.svelte'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import StakingInfo from './staked/StakingInfo.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakingIcon from '@icons/staking.svg'
  import ValidatorPlaceholder from '@icons/validator-placeholder.svg'
  import BookmarkValidator from '../bookmark-validator/BookmarkValidator.svelte'
  import { PERCENTAGE_TOTAL_STAKE_WARNING } from '@constants'
  import TopValidatorWarning from '../TopValidatorWarning.svelte'
  import type { TransformedValidator } from './ValidatorList.svelte'
  import { currentEpoch } from '@dashboard/routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/+layout.svelte'
  import Warning from './Warning.svelte'

  export let input:
    | {
        validator: TransformedValidator
        selectedUptime: UptimeValue
      }
    | 'loading'

  export let showStakeInfo = false

  $: uptime =
    input !== 'loading' ? input.validator[input.selectedUptime] : undefined

  $: top3Percent =
    input !== 'loading'
      ? input.validator.percentageTotalStake >= PERCENTAGE_TOTAL_STAKE_WARNING
      : false

  $: notTop100 =
    input !== 'loading' ? !input.validator.percentageTotalStake : false

  $: notRegistered = input !== 'loading' ? !input.validator.isRegistered : false
</script>

<div class="grid-wrapper full-width">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="validator-row card"
    class:extension={top3Percent || showStakeInfo || notTop100}
    class:top3Percent
    on:click
  >
    {#if $connected}
      <div class="icon" style:min-width="2rem">
        {#if showStakeInfo}
          <div style:transform="translateX(-0.4rem)">
            <IconNew icon={StakingIcon} --size="2.5rem" />
          </div>
        {:else if input === 'loading'}
          <SkeletonLoader width={30} />
        {:else}
          <BookmarkValidator validator={input.validator} />
        {/if}
      </div>
    {/if}

    <div class="padding image" class:left-padded={!$connected}>
      {#if input === 'loading'}
        <NftImage />
      {:else}
        <NftImage
          url={input.validator.metadata.expected.icon_url?.typed.value}
          defaultImageUrl={ValidatorPlaceholder}
          width={64}
          height={64}
        />
      {/if}
    </div>

    <div class="name">
      <div class="dotted-overflow">
        {#if input === 'loading'}
          <SkeletonLoader width={100} />
        {:else}
          {input.validator.metadata.expected.name?.typed.value ?? ''}
          <div class="mobile-only">
            <Address
              short
              value={input.validator.address}
              --background="var(--theme-surface-1)"
            />
          </div>
        {/if}
      </div>
    </div>

    <div class="center address desktop-only">
      {#if input === 'loading'}
        <SkeletonLoader width={80} />
      {:else}
        <Address
          short
          value={input.validator.address}
          --background="var(--theme-surface-1)"
        />
      {/if}
    </div>

    <div class="mobile-only stake-label">
      <span class="mobile-only">Total Stake (%)</span>
    </div>

    <div class="mobile-only accepts-label">
      <span class="mobile-only">Accepts Stakes</span>
    </div>

    <div class="center padding stake-display">
      {#if input === 'loading'}
        <StakeDisplay validator={new Promise(() => {})} />
      {:else}
        <StakeDisplay validator={Promise.resolve(input.validator)} />
      {/if}
    </div>

    <div class="center bold padding desktop-only" style:white-space="nowrap">
      {#if input === 'loading'}
        <SkeletonLoader width={80} />
      {:else}
        {formatXRDValue(input.validator.ownerStake.toString())}
      {/if}
    </div>

    <div class="apy apy-text-box no-overflow bold center">
      <span class="mobile-only apy-text-box-label">Apy</span>
      {#if input === 'loading'}
        <SkeletonLoader width={80} />
      {:else}
        <div>
          {input.validator.percentageTotalStake
            ? `${truncateNumber(input.validator.apy)}%`
            : 'N/A'}
          {#if input.validator.percentageTotalStake}
            <span class="subtext">per year</span>
          {/if}
        </div>
      {/if}
    </div>

    <div class="apy-text-box no-overflow bold center fee">
      <span class="mobile-only apy-text-box-label">Fee</span>
      {#if input === 'loading'}
        <SkeletonLoader width={50} />
      {:else}
        {#await $currentEpoch then epoch}
          {truncateNumber(input.validator.fee(epoch).percentage)}%
        {/await}
      {/if}
    </div>

    <div class="uptime apy-text-box no-overflow bold center uptime">
      <span class="mobile-only apy-text-box-label">Uptime</span>
      {#if input === 'loading'}
        <SkeletonLoader width={80} />
      {:else}
        {uptime ? `${truncateNumber(uptime)}%` : 'Not Measurable'}
      {/if}
    </div>

    <div class="accepts-stake center">
      {#if input === 'loading'}
        <SkeletonLoader width={30} />
      {:else}
        <AcceptsStake value={input.validator.acceptsStake} />
      {/if}
    </div>

    {#if $connected}
      <div class="select center">
        <SelectValidator
          validator={input === 'loading'
            ? new Promise(() => {})
            : Promise.resolve(input.validator)}
          text="SELECT"
        />
      </div>
    {/if}
  </div>

  {#if showStakeInfo}
    <div
      class="staking-info full-width"
      class:extension={top3Percent || notTop100}
    >
      <StakingInfo
        validator={input === 'loading'
          ? new Promise(() => {})
          : Promise.resolve(input.validator)}
        on:claim-validator
      />
    </div>
  {/if}

  {#if top3Percent}
    <div class="full-width" class:extension={notTop100}>
      <TopValidatorWarning />
    </div>
  {/if}

  {#if notRegistered}
    <div class="full-width">
      <Warning>
        <span class="bold">Not currently registered.</span>
        <span>Stakes do not get APY.</span>
      </Warning>
    </div>
  {:else if notTop100}
    <div class="full-width">
      <Warning>
        <span class="bold">Not within top 100.</span>
        <span>Stakes do not get APY.</span>
      </Warning>
    </div>
  {/if}
</div>

<style lang="scss">
  @mixin warning-border {
    border: var(--border) var(--color-alert-2);
  }

  @mixin extension {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
  }

  .validator-row {
    cursor: pointer;
    padding: var(--spacing-lg);
    display: grid;

    @include mixins.mobile {
      grid-template-columns: 60px repeat(5, 1fr) 50px 40px;
      grid-template-rows: auto 38px 38px minmax(auto, 50px);
      grid-template-areas:
        'image name name name name name icon header'
        'stake-label stake-label stake-label stake-label stake-value stake-value stake-value stake-value'
        'accepts-label accepts-label accepts-label accepts-label accepts-label accepts-label accepts-value accepts-value'
        '. . . . . . . .';
    }

    @include mixins.desktop {
      grid-template-columns: subgrid;
      grid-column: 1/-1;
      padding: var(--spacing-lg) var(--spacing-2xl);
    }

    &.extension {
      @include warning-border;
      @include extension;
    }
  }

  .grid-wrapper {
    display: grid;
    grid-template-columns: subgrid;

    &:hover {
      box-shadow: var(--shadow-hover);
    }

    transition: var(--transition-hover-card);

    border-radius: var(--border-radius-lg);
  }

  .staking-info {
    &.extension {
      :global(.staking-box) {
        @include extension;
        @include warning-border;
        border-top: none;
        border-bottom: none;
      }
    }
  }

  .bold {
    font-weight: var(--font-weight-bold-1);
  }

  .top-percent-warning {
    @include warning-border;

    * {
      color: var(--color-alert-1);
    }
    padding: var(--spacing-lg) var(--spacing-2xl);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    background: #fffcf5;
    border-top: none;
  }

  .icon {
    display: flex;
    align-items: center;
  }

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .padding {
    padding: 0 var(--spacing-md);
    @include mixins.mobile {
      padding: 0;
    }
  }

  .left-padded {
    padding-left: var(--spacing-xl);
    @include mixins.mobile {
      padding-left: 0;
    }
  }

  .name {
    display: flex;
    align-items: center;

    @include mixins.desktop {
      max-width: '15ch';
    }
    @include mixins.mobile {
      font-weight: var(--font-weight-bold-1);
    }
  }

  .no-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .apy {
    display: flex;
    @include mixins.desktop {
      gap: var(--spacing-md);
    }

    border-radius: var(--border-radius-lg) 0 0 var(--border-radius-lg);
    background: var(--theme-surface-1);
    min-width: 8rem;
  }

  .fee {
    min-width: 5rem;
  }

  .apy-text-box {
    align-self: center;
    display: flex;
    flex-direction: column;
    height: 2rem;
    border: 1px solid #e2e5ed;
    text-align: center;
    padding: var(--spacing-sm) 0;

    @include mixins.mobile {
      height: 3rem;
    }

    .apy-text-box-label {
      text-transform: uppercase;
      display: block;
      font-size: var(--text-sm);
      color: var(--color-grey-2);
    }
  }

  .uptime {
    border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
  }

  .accepts-stake {
    display: flex;
    justify-content: center;
  }

  .select {
    @include mixins.desktop {
      padding-right: var(--spacing-xl);
    }

    @include mixins.mobile {
      :global(button > label) {
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: center;
        justify-content: center;
      }
    }
  }

  .full-width {
    grid-column: 1 / -1;
  }

  @include mixins.mobile {
    .icon,
    .select {
      grid-area: icon;
      justify-content: center;
      align-items: center;
    }

    .select {
      grid-area: header;
    }

    .name,
    .address {
      grid-area: name;
    }

    .image {
      grid-area: image;
    }

    .fee,
    .uptime,
    .apy {
      grid-row-start: 4;
    }

    .apy {
      grid-column-start: 1;
      grid-column-end: 5;
    }

    .fee {
      grid-column-start: 5;
    }

    .uptime {
      grid-column-start: 6;
      grid-column-end: -1;
    }

    .stake-display {
      grid-area: stake-value;
      grid-column-end: -1;

      flex-direction: column;
      align-items: end;
    }

    .accepts-stake {
      grid-area: accepts-value;
      justify-content: end;
    }

    .stake-label {
      grid-area: stake-label;
    }

    .accepts-label {
      grid-area: accepts-label;
    }

    .stake-label,
    .accepts-label {
      justify-content: start;
      align-items: center;
      display: flex;
      color: var(--color-grey-2);
      text-transform: uppercase;
      font-weight: var(--font-weight-bold-1);
    }
  }

  @include mixins.desktop {
    .stake-display {
      max-width: 7rem;
    }
  }
</style>
