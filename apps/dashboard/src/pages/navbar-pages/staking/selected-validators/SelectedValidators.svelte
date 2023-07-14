<script lang="ts">
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import Icon from './Icon.svelte'
  import { selectedValidators } from '../Validators.svelte'

  $: count = Object.keys($selectedValidators).filter(
    (key) => $selectedValidators[key]
  ).length
</script>

<div id="selected-validators">
  <Icon />
  <div>
    You've selected {count} validators
  </div>
  <ButtonNew on:click size="big" disabled={count === 0}
    >Stake to multiple validators</ButtonNew
  >
</div>

<style lang="scss">
  @use '../../../../../../../packages/ui/src/mixins.scss';

  #selected-validators {
    @include mixins.card;
    border: none;
    display: grid;
    grid: auto / 0.5fr 2fr 2fr;
    align-items: center;
    justify-items: center;
    max-width: 50rem;
    min-width: 40rem;
    padding: var(--spacing-xl);
  }
</style>
