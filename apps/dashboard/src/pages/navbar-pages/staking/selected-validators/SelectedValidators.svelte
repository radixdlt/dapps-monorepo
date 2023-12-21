<script lang="ts">
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import { selectedValidators } from '../Validators.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import MultipleStaking from '@icons/multiple-staking.svg'
  import { createEventDispatcher } from 'svelte'
  import { track } from '@dashboard/routes/+layout.svelte'

  $: count = Object.keys($selectedValidators).filter(
    (key) => $selectedValidators[key]
  ).length

  const dispatch = createEventDispatcher<{
    'clear-all': undefined
    'stake-selected': undefined
  }>()
</script>

<div class="card selected-validators">
  <IconNew icon={MultipleStaking} --size="3.5rem" />
  <div>
    <div class="text">
      You've selected {count}
      {` ${count === 1 ? 'validator' : 'validators'}`}
    </div>
    {#if count > 0}
      <button on:click={() => dispatch('clear-all')}>Clear all</button>
    {/if}
  </div>
  <ButtonNew
    on:click={() => {
      track('click:stake-selected-validators')
      dispatch('stake-selected')
    }}
    size="big"
    disabled={count === 0}>Stake to Selected</ButtonNew
  >
</div>

<style lang="scss">
  .selected-validators {
    display: grid;
    grid: auto / auto auto auto;
    align-items: center;
    justify-items: center;
    gap: var(--spacing-xl);
    padding: 0 var(--spacing-lg);
  }

  .text {
    font-weight: var(--font-weight-bold-2);
  }
</style>
