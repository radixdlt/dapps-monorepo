<script lang="ts">
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import { selectedValidators } from '../Validators.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import MultipleStaking from '@icons/multiple-staking.svg'

  $: count = Object.keys($selectedValidators).filter(
    (key) => $selectedValidators[key]
  ).length
</script>

<div class="selected-validators">
  <IconNew icon={MultipleStaking} --size="3.5rem" />
  <div class="text">
    You've selected {count} validators
  </div>
  <ButtonNew on:click size="big" disabled={count === 0}
    >Stake to Selected Validators</ButtonNew
  >
</div>

<style lang="scss">
  @use '../../../../../../../packages/ui/src/mixins.scss';

  .selected-validators {
    @include mixins.card;
    display: grid;
    grid: auto / 0.5fr 4fr 15rem;
    align-items: center;
    justify-items: center;
    width: 36.625rem;
    height: 4.8125rem;
    padding: 0 var(--spacing-xl);
  }

  .text {
    font-weight: var(--font-weight-bold-2);
  }
</style>
