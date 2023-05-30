<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import CloseButton from '@components/_base/side-panel/CloseButton.svelte'
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import FilterCard from './filter-card/FilterCard.svelte'

  export let open: boolean
  export let feeValues: number[]
  export let totalXRDStakeValues: number[]
  export let ownerStakeValues: number[]
</script>

<SidePanel bind:open>
  <div id="header">
    <CloseButton />
    <h3>Validator Filters</h3>
    <div />
  </div>
  <Divider />

  <h2>Fee (%)</h2>
  <p class="subtext">Amount the validator takes when you stake</p>

  <div class="filter-card">
    <FilterCard
      values={feeValues}
      minText="MIN FEE (%)"
      maxText="MAX FEE (%)"
    />
  </div>

  <Divider />

  <h2>Total XRD Stake (%)</h2>
  <p class="subtext">The total amount of stakes made with the validator</p>

  <div class="filter-card">
    <FilterCard
      values={totalXRDStakeValues}
      minText="MIN AMOUNT (%)"
      maxText="MAX AMOUNT (%)"
    />
  </div>

  <Divider />

  <h2>Owner Stake (%)</h2>
  <p class="subtext">The amount the owner has staked to their own validator</p>

  <div class="filter-card">
    <FilterCard
      values={ownerStakeValues}
      minText="MIN STAKE (%)"
      maxText="MAX STAKE (%)"
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

  .subtext {
    @include mixins.subtext;
    margin-bottom: var(--spacing-xl);
  }

  .filter-card {
    display: flex;
    justify-content: center;
  }
</style>
