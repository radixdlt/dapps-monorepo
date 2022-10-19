<script lang="ts">
  import { navigating } from '$app/stores'
  import LoadingSpinner from '@components/_base/loading-spinner/LoadingSpinner.svelte'
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
