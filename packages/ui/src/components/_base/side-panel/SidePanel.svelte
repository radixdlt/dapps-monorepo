<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  export let open = true
  export let useBackdrop = false

  const dispatch = createEventDispatcher<{
    close: null
  }>()

  let panel: HTMLDivElement

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') dispatch('close')
  }
</script>

<svelte:window on:keydown={(e) => handleKeydown(e)} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if open}
  {#if useBackdrop}
    <div
      class="backdrop"
      transition:fade={{ duration: 300 }}
      on:click|self={() => {
        dispatch('close')
      }}
    />
  {/if}

  <div
    role="dialog"
    class="side-panel"
    bind:this={panel}
    transition:fly={{ duration: 300, opacity: 1, x: 700 }}
  >
    <slot />
  </div>
{/if}

<style lang="scss">
  .side-panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: var(--width, 45rem);
    background: var(--color-grey-5);
    z-index: 3;
    overflow-y: scroll;
    padding: var(--spacing-2xl) var(--spacing-3xl);
  }

  .backdrop {
    backdrop-filter: blur(8px);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
  }
</style>
