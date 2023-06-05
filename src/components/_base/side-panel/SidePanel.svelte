<script lang="ts">
  import { fade } from 'svelte/transition'

  export let open = false

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') open = false
  }

  $: document.body.style.overflow = open ? 'hidden' : 'auto'
</script>

<svelte:window on:keydown={(e) => handleKeydown(e)} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if open}
  <div
    id="backdrop"
    transition:fade={{ duration: 300 }}
    on:click|self={() => (open = false)}
  />
{/if}
<div role="dialog" id="side-panel" class:closed={!open}>
  <slot />
</div>

<style lang="scss">
  #side-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 60vw;
    max-width: 70rem;
    background: var(--color-grey-5);
    z-index: 3;
    overflow-y: scroll;
    padding: var(--spacing-2xl) var(--spacing-3xl);

    transition: transform 300ms ease-in-out;
  }

  .closed {
    transform: translateX(100%);
  }

  #backdrop {
    backdrop-filter: blur(8px);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
  }
</style>
