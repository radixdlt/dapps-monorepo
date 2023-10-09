<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import HistogramFilterCard from './histogram-filter-card/HistogramFilterCard.svelte'
  import ManualFilterCard from './manual-filter-card/ManualFilterCard.svelte'
  import SwitchFilterCard from './switch-filter-card/SwitchFilterCard.svelte'
  import { createEventDispatcher } from 'svelte'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import type { Validator } from '@api/utils/entities/validator'

  export let open: boolean
  export let feeValues: number[]
  export let totalXRDStakeValues: number[]

  let feeFilter: [number, number] = [0, 100]

  let totalXRDStakeFilter: [number, number] = [0, 100]

  let acceptsStakeFilter = false
  let bookmarkedFilter = false

  const recentUptimeOptions: {
    label: string
    value: keyof Validator['uptimePercentages']
    default?: boolean
  }[] = [
    { label: '1 day', value: '1day' },
    { label: '1 week', value: '1week' },
    { label: '1 month', value: '1month' },
    { label: '3 months', value: '3months' },
    { label: '6 months', value: '6months' },
    { label: '1 year', value: '1year' },
    { label: 'All time', value: 'alltime', default: true }
  ]

  const changeDefaultUptime = (
    uptime: (typeof recentUptimeOptions)[number]['value']
  ) => {
    recentUptimeOptions.forEach((option) => {
      option.default = option.value === uptime
    })
  }

  $: changeDefaultUptime(selectedUptime.value)

  let selectedUptime =
    recentUptimeOptions.find((option) => option.default) ||
    recentUptimeOptions[0]

  let uptimeFilterPercentage = 0

  $: uptimeFilter = {
    timeframe: selectedUptime.value,
    percentage: uptimeFilterPercentage
  }

  const onClose = () => {
    dispatch('close', {
      feeFilter,
      totalXRDStakeFilter,
      uptimeFilter,
      acceptsStakeFilter,
      bookmarkedFilter
    })
  }

  const dispatch = createEventDispatcher<{
    close: {
      feeFilter: typeof feeFilter
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
      options={recentUptimeOptions}
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
