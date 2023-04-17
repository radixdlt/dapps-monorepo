<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'
  import StakeDisplay from './StakeDisplay.svelte'
  import ApyBox from './ApyBox.svelte'
  import Address from './Address.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import { createEventDispatcher } from 'svelte'

  export let name: string
  export let address: string
  export let totalStake: number
  export let percentageOwnerStake: number
  export let apy: number
  export let fee: number
  export let uptime: number
  export let acceptsStake: boolean
  export let percentageTotalStake: number

  const dispatch = createEventDispatcher()

  let selected: { label: string; checked: boolean }[] = []

  $: if (selected.length === 0) dispatch('unselected')
  $: if (selected.length === 1) dispatch('selected')
</script>

<div class="validator-card">
  <div class="icon">
    <slot name="icon" />
  </div>

  <div class="name">
    {name}
  </div>

  <div class="address">
    <Address {address} />
  </div>

  <div class="info-column" style:min-width="6 rem">
    <StakeDisplay amount={totalStake} percentage={percentageTotalStake} />
  </div>

  <div class="info-column">
    {percentageOwnerStake}%
  </div>

  <div class="info-column">
    <ApyBox {apy} {fee} {uptime} />
  </div>

  <div class="info-column" style:line-height="0">
    {#if acceptsStake}
      <Icon size="small" type="checkmark" />
    {:else}
      <div style:color="var(--color-alert)">
        <Icon size="small" type="cross" />
      </div>
    {/if}
  </div>

  <div class="info-column last-column" style:min-width="10rem">
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
  </div>
</div>

<style>
  .validator-card {
    display: grid;
    grid: 1fr / 5rem 4fr 2fr 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
    box-shadow: var(--shadow);
    border-radius: var(--border-radius);
    background: var(--color-light);
    padding: var(--spacing-lg) 0;
    border: var(--border);
    min-width: fit-content;
    cursor: pointer;
    transition: var(--transition-hover-card);
  }

  .validator-card:hover {
    transform: var(--transform-hover-card);
    box-shadow: var(--shadow-hover);
  }

  .icon {
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: var(--border-divider);
  }
  .name {
    font-weight: var(--font-weight-bold-2);
    padding-left: var(--spacing-md);
    min-width: 10rem;
  }

  .address {
    height: 80%;
    width: 100%;
    display: flex;
    justify-self: center;
    justify-content: end;
    border-right: var(--border-divider);
    padding-right: var(--spacing-md);
  }

  .info-column {
    padding: 0 2rem;
  }

  .last-column {
    justify-content: end;
    padding-right: 0;
  }
</style>
