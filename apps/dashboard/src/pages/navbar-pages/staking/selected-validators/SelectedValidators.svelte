<script lang="ts">
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import Icon from './Icon.svelte'
  import { context } from '../Validators.svelte'

  const selected = context.get('selectedValidators')

  $: count = Object.keys($selected).filter((key) => $selected[key]).length
</script>

<div id="selected-validators">
  <Icon />
  <div>
    You've selected {count} validators
  </div>
  <ButtonNew size="big">Stake to multiple validators</ButtonNew>
</div>

<style lang="scss">
  @use '../../../../../../../packages/ui/src/mixins.scss';

  #selected-validators {
    @include mixins.card(false);
    display: grid;
    grid: auto / 0.5fr 2fr 2fr;
    align-items: center;
    justify-items: center;
    max-width: 50rem;
    min-width: 40rem;
    padding-left: var(--spacing-xl);
    padding-right: var(--spacing-xl);
    top: var(--spacing-xl);
  }
</style>
