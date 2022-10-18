<script lang="ts">
  import LoadingSpinner from '@components/_base/loading-spinner/LoadingSpinner.svelte'
  import { navigating } from '@stores'
</script>

{#if $navigating}
  {#await new Promise((resolve) => setTimeout(resolve, 300)) then}
    <center>
      <LoadingSpinner />
    </center>
  {/await}
{:else}
  <slot />
{/if}
