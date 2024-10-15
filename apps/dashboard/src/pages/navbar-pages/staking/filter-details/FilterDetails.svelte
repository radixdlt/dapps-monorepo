<script lang="ts" context="module">
  export const DEFAULT_VALIDATORS_FILTER = {
    feeFilter: [0, 100] as [number, number],
    withinTop100Filter: true,
    totalXRDStakeFilter: [0, 100] as [number, number],
    uptimeFilterPercentage: 0,
    uptimeFilter: {
      timeframe: '1month' as UptimeValue,
      percentage: 0
    },
    acceptsStakeFilter: false,
    bookmarkedFilter: false
  }
</script>

<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import HistogramFilterCard from './histogram-filter-card/HistogramFilterCard.svelte'
  import ManualFilterCard from './manual-filter-card/ManualFilterCard.svelte'
  import SwitchFilterCard from './switch-filter-card/SwitchFilterCard.svelte'
  import { createEventDispatcher } from 'svelte'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import { type UptimeValue } from '@api/utils/entities/component/validator'

  export let open: boolean
  export let feeValues: number[]
  export let totalXRDStakeValues: number[]

  export const reset = () => {
    feeFilter = DEFAULT_VALIDATORS_FILTER.feeFilter
    bookmarkedFilter = DEFAULT_VALIDATORS_FILTER.bookmarkedFilter
    withinTop100Filter = DEFAULT_VALIDATORS_FILTER.withinTop100Filter
    acceptsStakeFilter = DEFAULT_VALIDATORS_FILTER.acceptsStakeFilter
    totalXRDStakeFilter = DEFAULT_VALIDATORS_FILTER.totalXRDStakeFilter
    uptimeFilterPercentage = DEFAULT_VALIDATORS_FILTER.uptimeFilterPercentage
  }
  let {
    feeFilter,
    bookmarkedFilter,
    withinTop100Filter,
    acceptsStakeFilter,
    totalXRDStakeFilter,
    uptimeFilterPercentage
  } = DEFAULT_VALIDATORS_FILTER

  let selectedUptime: UptimeValue = '1month'

  $: uptimeFilter = {
    timeframe: selectedUptime,
    percentage: uptimeFilterPercentage
  }

  const onClose = () => {
    dispatch('close', {
      feeFilter,
      totalXRDStakeFilter,
      uptimeFilter,
      withinTop100Filter,
      acceptsStakeFilter,
      bookmarkedFilter
    })
  }

  const dispatch = createEventDispatcher<{
    close: {
      feeFilter: typeof feeFilter
      withinTop100Filter: boolean
      totalXRDStakeFilter: typeof totalXRDStakeFilter
      uptimeFilter: typeof uptimeFilter
      acceptsStakeFilter: boolean
      bookmarkedFilter: boolean
    }
  }>()
</script>

<SidePanel bind:open useBackdrop on:close={onClose} --width="35rem">
  <SidePanelHeader text="Validator Filters" on:closeClick={onClose} />

  <div class="cards">
    <SwitchFilterCard
      title="Top 100"
      description="Show only validators that currently generate APY"
      bind:on={withinTop100Filter}
    />

    <SwitchFilterCard
      title="Accepts Stake"
      description="Show only validators that currently accepts new stake"
      bind:on={acceptsStakeFilter}
    />

    <SwitchFilterCard
      title="Bookmarked"
      description="Show only validators that you have bookmarked"
      bind:on={bookmarkedFilter}
    />
  </div>

  <Divider />

  <div class="text">
    <h3>Fee (%)</h3>
    <p class="subtext">% of rewards emissions taken by the validator owner</p>
  </div>

  <div class="card">
    <HistogramFilterCard
      values={feeValues}
      minText="MIN FEE (%)"
      maxText="MAX FEE (%)"
      bind:range={feeFilter}
    />
  </div>

  <Divider />

  <div class="text">
    <h3>Total XRD Stake (%)</h3>
    <p class="subtext">The total amount of stakes made with the validator</p>
  </div>

  <div class="card">
    <HistogramFilterCard
      max={Math.max(...totalXRDStakeValues)}
      values={totalXRDStakeValues}
      minText="MIN AMOUNT (%)"
      maxText="MAX AMOUNT (%)"
      bind:range={totalXRDStakeFilter}
    />
  </div>

  <Divider />

  <div class="text">
    <h3>Recent Uptime (%)</h3>
    <p class="subtext">Minimum validator uptime over a recent period of time</p>
  </div>

  <div class="card">
    <ManualFilterCard
      bind:selected={selectedUptime}
      bind:percentage={uptimeFilterPercentage}
    />
  </div>
</SidePanel>

<style lang="scss">
  .text {
    margin-bottom: var(--spacing-xl);
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
</style>
