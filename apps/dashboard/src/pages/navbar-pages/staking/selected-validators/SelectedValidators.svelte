<script lang="ts">
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import { selectedValidators } from '../Validators.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import MultipleStaking from '@icons/multiple-staking.svg'

  $: count = Object.keys($selectedValidators).filter(
    (key) => $selectedValidators[key]
  ).length
</script>

<div class="card selected-validators">
  <IconNew icon={MultipleStaking} --size="3.5rem" />
  <div class="text">
    You've selected {count}
    {` ${count === 1 ? 'validator' : 'validators'}`}
  </div>
  <ButtonNew on:click size="big" disabled={count === 0}
    >Stake to Selected</ButtonNew
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
