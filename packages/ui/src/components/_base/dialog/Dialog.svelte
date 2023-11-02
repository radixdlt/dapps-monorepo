<script lang="ts">
  import { fade, scale } from 'svelte/transition'
  import Backdrop from '../backdrop/Backdrop.svelte'

  export let open = false
</script>

{#if open}
  <Backdrop zIndex={4} duration={200} />
  <div
    class="dialog card"
    transition:scale={{
      duration: 200
    }}
  >
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
