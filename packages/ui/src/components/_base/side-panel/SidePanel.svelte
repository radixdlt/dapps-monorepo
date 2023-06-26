<script lang="ts" context="module">
  import { writable } from 'svelte/store'

  export const panelStack = writable<string[]>([])
</script>

<script lang="ts">
  import { fade, fly } from 'svelte/transition'

  export let open = false

  let panel: HTMLDivElement

  const id = Math.random().toString(36).substring(2, 15)

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && $panelStack[$panelStack.length - 1] === id) {
      open = false
    }
  }

  const pushToStack = () => {
    if (!$panelStack.includes(id)) {
      $panelStack.push(id)
      $panelStack = $panelStack
    }
  }

  const popFromStack = () => {
    if ($panelStack[$panelStack.length - 1] === id) {
      $panelStack.pop()
      $panelStack = $panelStack
    }
  }

  $: if (open) {
    pushToStack()
  } else {
    popFromStack()
  }

  $: document.body.style.overflow = $panelStack.length > 0 ? 'hidden' : 'auto'
</script>

<svelte:window on:keydown={(e) => handleKeydown(e)} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if open}
  {#if $panelStack[0] === id}
    <div
      class="backdrop"
      transition:fade={{ duration: 300 }}
      on:click|self={() => {
        open = false
        $panelStack = []
      }}
    />
  {/if}
  <div
    role="dialog"
    class="side-panel"
    bind:this={panel}
    transition:fly={{ duration: 300, opacity: 1, x: 1000 }}
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
    width: 60vw; 
    max-width: 70rem;
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
