<script>
  import { fade } from 'svelte/transition'

  export let zIndex = 2
  export let duration = 300
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="backdrop"
  transition:fade|global={{ duration }}
  on:click|self
  style:z-index={zIndex}
/>

<style>
  .backdrop {
    backdrop-filter: blur(8px);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
