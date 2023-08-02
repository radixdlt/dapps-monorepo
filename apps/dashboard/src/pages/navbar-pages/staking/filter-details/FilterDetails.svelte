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

  let feeFilter: [number, number] = [0, 100]

  let totalXRDStakeFilter: [number, number] = [0, 100]

  let ownerStakeFilter: [number, number] = [0, 100]

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

  let selectedUptime = recentUptimeOptions[0]

  const onClose = () => {
    dispatch('close', {
      feeFilter,
      totalXRDStakeFilter,
      ownerStakeFilter,
      uptimeFilter,
      acceptsStakeFilter,
      bookmarkedFilter
    })
  }

  const dispatch = createEventDispatcher<{
    close: {
      feeFilter: typeof feeFilter
      totalXRDStakeFilter: typeof totalXRDStakeFilter
      ownerStakeFilter: typeof ownerStakeFilter
      uptimeFilter: typeof uptimeFilter
      acceptsStakeFilter: boolean
      bookmarkedFilter: boolean
    }
  }>()
</script>

<SidePanel bind:open useBackdrop on:close={onClose}>
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
    <h2>Fee (%)</h2>
    <p class="subtext">% of rewards emissions taken by the validator owner</p>
  </div>

  <div class="cards">
    <HistogramFilterCard
      values={feeValues}
      minText="MIN FEE (%)"
      maxText="MAX FEE (%)"
      bind:range={feeFilter}
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
      bind:range={totalXRDStakeFilter}
    />
  </div>

  <Divider />

  <div class="text">
    <h2>Owner Stake (%)</h2>
    <p class="subtext">% of this validator’s stake provided by its owner</p>
  </div>

  <div class="cards">
    <HistogramFilterCard
      values={ownerStakeValues}
      minText="MIN STAKE (%)"
      maxText="MAX STAKE (%)"
      bind:range={ownerStakeFilter}
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
