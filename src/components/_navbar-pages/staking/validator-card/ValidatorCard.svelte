<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'
  import StakeDisplay from './StakeDisplay.svelte'
  import ApyBox from './ApyBox.svelte'
  import Address from './Address.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import { createEventDispatcher } from 'svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { truncateNumber } from '@utils'

  export let validatorInfo: Promise<{
    name: string
    address: string
    totalStake: number
    percentageOwnerStake: number
    apy: number
    fee: number
    uptime: number
    acceptsStake: boolean
    percentageTotalStake: number
  }>

  const dispatch = createEventDispatcher()

  let selected: { label: string; checked: boolean }[] = []

  $: if (selected.length === 0) dispatch('unselected')
  $: if (selected.length === 1) dispatch('selected')
</script>

<div id="validator-card">
  <div id="icon">
    {#await validatorInfo then}
      <slot name="icon" />
    {/await}
  </div>

  <div id="name">
    {#await validatorInfo}
      <SkeletonLoader width={200} />
    {:then { name }}
      {name}
    {/await}
  </div>

  <div id="address">
    {#await validatorInfo}
      <SkeletonLoader width={80} />
    {:then { address }}
      <Address {address} />
    {/await}
  </div>

  <div class="info-column" style:min-width="6 rem">
    <StakeDisplay stakeInfo={validatorInfo} />
  </div>

  <div class="info-column">
    {#await validatorInfo}
      <SkeletonLoader width={30} />
    {:then { percentageOwnerStake }}
      {truncateNumber(percentageOwnerStake)}%
    {/await}
  </div>

  <div class="info-column">
    <ApyBox apyInfo={validatorInfo} />
  </div>

  <div class="info-column" style:line-height="0">
    {#await validatorInfo}
      <SkeletonLoader width={20} />
    {:then { acceptsStake }}
      {#if acceptsStake}
        <Icon size="small" type="checkmark" />
      {:else}
        <div style:color="var(--color-alert)">
          <Icon size="small" type="cross" />
        </div>
      {/if}
    {/await}
  </div>

  <div class="info-column last-column" style:min-width="10rem">
    {#await validatorInfo then}
      <Checkbox
        options={[
          {
            label: 'SELECT',
            checked: false
          }
        ]}
        bind:selected
        --label-color="var(--color-grey-2)"
      />
    {/await}
  </div>
</div>

<style lang="scss">
  @use './shared.scss';
  #validator-card {
    @include shared.validator-card-grid;
    align-items: center;
    box-shadow: var(--shadow);
    border-radius: var(--border-radius);
    background: var(--color-light);
    padding: var(--spacing-lg) 0;
    border: var(--border);
    cursor: pointer;
    transition: var(--transition-hover-card);
    height: 5rem;
  }

  #validator-card:hover {
    transform: var(--transform-hover-card);
    box-shadow: var(--shadow-hover);
  }

  #icon {
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: var(--border-divider);
  }
  #name {
    font-weight: var(--font-weight-bold-2);
    padding-left: var(--spacing-md);
  }

  #address {
    height: 80%;
    width: 100%;
    display: flex;
    justify-self: center;
    align-items: center;
    justify-content: end;
    border-right: var(--border-divider);
    padding-right: var(--spacing-md);
  }

  .info-column {
    padding: 0 2rem;
    justify-self: center;
  }

  .last-column {
    justify-content: end;
    padding-right: 0;
  }
</style>
