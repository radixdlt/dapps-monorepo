<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import StakeDisplay from './StakeDisplay.svelte'
  import { formatXRDValue, truncateNumber } from '@utils'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import { connected } from '@stores'
  import type { UptimeValue } from './UptimeHeader.svelte'
  import { ColumnIds, type TransformedValidator } from './ValidatorList.svelte'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import Section from '@components/_base/table/grid-table/Section.svelte'
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'

  export let input:
    | {
        validator: TransformedValidator
        selectedUptime: UptimeValue
      }
    | 'loading'

  export let columnIds: ColumnIds[]

  $: uptime =
    input !== 'loading' ? input.validator[input.selectedUptime] : undefined
</script>

<Section {columnIds} let:columnIds>
  <div class="validator-row card">
    {#if $connected}
      <Section {columnIds} renderAt={ColumnIds.stakingIconBookmark}>
        <div class="center" style:min-width="3rem">
          <slot name="icon" />
        </div>
      </Section>
    {/if}

    <Section {columnIds} renderAt={ColumnIds.icon}>
      <div class:left-padded={!$connected}>
        {#if input === 'loading'}
          <NftImage />
        {:else}
          <NftImage
            url={input.validator.metadata.standard.icon_url?.value.href}
            width={64}
            height={64}
          />
        {/if}
      </div>
    </Section>

    <Section {columnIds} renderAt={ColumnIds.name}>
      <div class="name">
        <div class="dotted-overflow" style:max-width="15ch">
          {#if input === 'loading'}
            <SkeletonLoader width={100} />
          {:else}
            {input.validator.metadata.standard.name?.value ?? ''}
          {/if}
        </div>
      </div>
    </Section>

    <Section {columnIds} renderAt={ColumnIds.address}>
      <div class="center">
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
    </Section>

    <Section {columnIds} renderAt={ColumnIds.totalStake}>
      <div class="center padding">
        {#if input === 'loading'}
          <StakeDisplay validator={new Promise(() => {})} />
        {:else}
          <StakeDisplay validator={Promise.resolve(input.validator)} />
        {/if}
      </div>
    </Section>

    <Section {columnIds} renderAt={ColumnIds.ownerStake}>
      <div class="center bold padding">
        {#if input === 'loading'}
          <SkeletonLoader width={80} />
        {:else}
          {formatXRDValue(input.validator.ownerStake.toString())}
        {/if}
      </div>
    </Section>

    <Section
      {columnIds}
      renderAt={{ start: ColumnIds.apy, end: ColumnIds.uptime }}
      let:columnIds
    >
      <div class="apy-box center">
        <Section {columnIds} renderAt={ColumnIds.apy}>
          <div class="apy apy-text-box no-overflow bold center">
            {#if input === 'loading'}
              <SkeletonLoader width={80} />
            {:else}
              {input.validator.rank <= 100
                ? `${truncateNumber(input.validator.apy)}%`
                : 'N/A'}
              {#if input.validator.rank <= 100}
                <span class="subtext">per year</span>
              {/if}
            {/if}
          </div>
        </Section>

        <Section {columnIds} renderAt={ColumnIds.feePercentage}>
          <div class="apy-text-box no-overflow bold center">
            {#if input === 'loading'}
              <SkeletonLoader width={50} />
            {:else}
              {truncateNumber(input.validator.fee.percentage)}%
            {/if}
          </div>
        </Section>

        <Section {columnIds} renderAt={ColumnIds.uptime}>
          <div class="uptime apy-text-box no-overflow bold center">
            {#if input === 'loading'}
              <SkeletonLoader width={80} />
            {:else}
              {uptime ? `${truncateNumber(uptime)}%` : 'Not Measurable'}
            {/if}
          </div>
        </Section>
      </div>
    </Section>

    <Section {columnIds} renderAt={ColumnIds.acceptsStake}>
      <div class="accepts-stake center">
        {#if input === 'loading'}
          <SkeletonLoader width={30} />
        {:else}
          <AcceptsStake value={input.validator.acceptsStake} />
        {/if}
      </div>
    </Section>

    {#if $connected}
      <Section {columnIds} renderAt={ColumnIds.select}>
        <div class="select center">
          <SelectValidator
            validator={input === 'loading'
              ? new Promise(() => {})
              : Promise.resolve(input.validator)}
            text="SELECT"
          />
        </div>
      </Section>
    {/if}
  </div>
</Section>

<style lang="scss">
  .validator-row {
    cursor: pointer;
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1/-1;
    padding: var(--spacing-lg) var(--spacing-lg);

    &:hover {
      box-shadow: var(--shadow-hover);
    }

    transition: var(--transition-hover-card);
  }

  .bold {
    font-weight: var(--font-weight-bold-1);
  }

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .padding {
    padding: 0 var(--spacing-md);
  }

  .left-padded {
    padding-left: var(--spacing-xl);
  }

  .name {
    display: flex;
    align-items: center;
  }

  .no-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .apy-box {
    display: grid;
    grid-gap: 0;
    grid-template-columns: subgrid;
    grid-column: 1/-1;
  }

  .apy {
    display: flex;
    gap: var(--spacing-md);
    border-radius: var(--border-radius-lg) 0 0 var(--border-radius-lg);
    background: var(--theme-surface-1);
    min-width: 8rem;
  }

  .apy-text-box {
    border: 1px solid #e2e5ed;
    text-align: center;
    padding: var(--spacing-sm) var(--spacing-lg);
  }

  .uptime {
    border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
  }

  .accepts-stake {
    display: flex;
    justify-content: center;
  }

  .select {
    padding-right: var(--spacing-xl);
  }
</style>
