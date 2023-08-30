<script lang="ts">
  import Switch from '@components/_base/switch/Switch.svelte'

  export let on: boolean
</script>

<div class="card distribute-switch">
  <div class="text">Distribute equally between validators</div>
  <Switch bind:on />
</div>

<style lang="scss">
  @use '../../../../../../../../../packages/ui/src/mixins.scss';

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
