<script lang="ts">
  import Switch from '@components/_base/switch/Switch.svelte'
  import { track } from '@dashboard/routes/+layout.svelte'

  export let on: boolean
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="card distribute-switch">
  <div class="text">Distribute equally between validators</div>
  <Switch on:click={() => track('click:stake-distribute-equally')} bind:on />
</div>

<style lang="scss">
  .distribute-switch {
    box-shadow: none;
    display: flex;
    align-items: center;
    padding: var(--spacing-lg) var(--spacing-xl);
    gap: var(--spacing-md);

    .text {
      color: var(--subtext-color);
    }
  }
</style>
