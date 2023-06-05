<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import CloseButton from '@components/_base/side-panel/CloseButton.svelte'
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import HistogramFilterCard from './histogram-filter-card/HistogramFilterCard.svelte'
  import ManualFilterCard from './manual-filter-card/ManualFilterCard.svelte'
  import SwitchFilterCard from './switch-filter-card/SwitchFilterCard.svelte'
  import { createEventDispatcher } from 'svelte'

  export let open: boolean
  export let feeValues: number[]
  export let totalXRDStakeValues: number[]
  export let ownerStakeValues: number[]

  let feeFilter = {
    min: 0,
    max: 100
  }
  let totalXRDStakeFilter = {
    min: 0,
    max: 100
  }
  let ownerStakeFilter = {
    min: 0,
    max: 100
  }
  let uptimeFilter = {
    days: 1,
    percentage: 0
  }
  let acceptsStakeFilter = false
  let bookmarkedFilter = false

  const recentUptimeOptions = [
    { label: '1 day', value: 1 },
    { label: '1 week', value: 7 },
    { label: '1 month', value: 30 },
    { label: '3 months', value: 90 },
    { label: '6 months', value: 180 },
    { label: '1 year', value: 365 }
  ]

  const dispatchApplyFilterEvent = createEventDispatcher<{
    applyFilter: {
      feeFilter: typeof feeFilter
      totalXRDStakeFilter: typeof totalXRDStakeFilter
      ownerStakeFilter: typeof ownerStakeFilter
      uptimeFilter: typeof uptimeFilter
      acceptsStakeFilter: boolean
      bookmarkedFilter: boolean
    }
  }>()

  let selectedUptime = recentUptimeOptions[0]

  const onClose = () => {
    dispatchApplyFilterEvent('applyFilter', {
      feeFilter,
      totalXRDStakeFilter,
      ownerStakeFilter,
      uptimeFilter,
      acceptsStakeFilter,
      bookmarkedFilter
    })
  }

  $: if (!open) onClose()
</script>

<SidePanel bind:open>
  <div id="header">
    <CloseButton on:click={() => (open = false)} />
    <h3>Validator Filters</h3>
    <div />
  </div>
  <Divider />

  <div class="text">
    <h2>Fee (%)</h2>
    <p class="subtext">Amount the validator takes when you stake</p>
  </div>

  <div class="cards">
    <HistogramFilterCard
      values={feeValues}
      minText="MIN FEE (%)"
      maxText="MAX FEE (%)"
      bind:min={feeFilter.min}
      bind:max={feeFilter.max}
    />
  </div>

  <Divider />

  <div class="text">
    <h2>Total XRD Stake (%)</h2>
    <p class="subtext">The total amount of stakes made with the validator</p>
  </div>

  <div class="cards">
    <HistogramFilterCard
      values={totalXRDStakeValues}
      minText="MIN AMOUNT (%)"
      maxText="MAX AMOUNT (%)"
      bind:min={totalXRDStakeFilter.min}
      bind:max={totalXRDStakeFilter.max}
    />
  </div>

  <Divider />

  <div class="text">
    <h2>Owner Stake (%)</h2>
    <p class="subtext">
      The amount the owner has staked to their own validator
    </p>
  </div>

  <div class="cards">
    <HistogramFilterCard
      values={ownerStakeValues}
      minText="MIN STAKE (%)"
      maxText="MAX STAKE (%)"
      bind:min={ownerStakeFilter.min}
      bind:max={ownerStakeFilter.max}
    />
  </div>

  <Divider />

  <div class="text">
    <h2>Recent Uptime (%)</h2>
    <p class="subtext">The amount of time the validator has been active</p>
  </div>

  <div class="cards">
    <ManualFilterCard
      options={recentUptimeOptions}
      selected={selectedUptime}
      bind:percentage={uptimeFilter.percentage}
    />
  </div>

  <Divider />

  <div class="text">
    <h2>Other Options</h2>
  </div>

  <div class="cards">
    <SwitchFilterCard
      title="Accepts Stake"
      description="Validators you're able to stake to"
      bind:on={acceptsStakeFilter}
    />

    <SwitchFilterCard
      title="Bookmarked"
      description="Validators that you have bookmarked"
      bind:on={bookmarkedFilter}
    />
  </div>
</SidePanel>

<style lang="scss">
  @use '../../../../mixins.scss';

  #header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .text {
    margin-bottom: var(--spacing-xl);
  }

  .cards {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
</style>
