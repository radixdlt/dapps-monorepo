<script lang="ts">
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{
    'navigate-to-details': null
  }>()
</script>

<div class="summary">
  For summary view go to the validator's details on the staking section.

  <div>
    <ButtonNew size="big" on:click={() => dispatch('navigate-to-details')}
      >Details View</ButtonNew
    >
  </div>
</div>

<style>
  .summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-3xl);
    margin-top: var(--spacing-3xl);
  }
</style>
