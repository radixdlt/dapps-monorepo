<script lang="ts">
  import { fade } from 'svelte/transition'
  import Backdrop from '../backdrop/Backdrop.svelte'

  export let open = false
</script>

{#if open}
  <Backdrop />
  <div class="dialog card" transition:fade>
    <slot />
  </div>
{/if}

<style lang="scss">
  .dialog {
    position: fixed;
    z-index: 1000;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: var(--theme-surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);

    @include mixins.desktop {
      padding: var(--spacing-xl);
    }
  }
</style>
