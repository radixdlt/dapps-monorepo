<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import HistogramFilterCard from './histogram-filter-card/HistogramFilterCard.svelte'
  import ManualFilterCard from './manual-filter-card/ManualFilterCard.svelte'
  import SwitchFilterCard from './switch-filter-card/SwitchFilterCard.svelte'
  import { createEventDispatcher } from 'svelte'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'

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
    percentage: '0'
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
  <SidePanelHeader
    text="Validator Filters"
    on:closeClick={() => (open = false)}
  />

  <div class="text">
    <h2>Fee (%)</h2>
    <p class="subtext">Amount the validator takes when you stake</p>
  </div>

  <div class="cards">
    <HistogramFilterCard
      values={feeValues}
      minText="MIN FEE (%)"
      maxText="MAX FEE (%)"
      bind:lowValue={feeFilter.min}
      bind:highValue={feeFilter.max}
      max={5}
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
      bind:lowValue={totalXRDStakeFilter.min}
      bind:highValue={totalXRDStakeFilter.max}
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
      bind:lowValue={ownerStakeFilter.min}
      bind:highValue={ownerStakeFilter.max}
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
  @use '../../../../../../../packages/ui/src/mixins.scss';

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
