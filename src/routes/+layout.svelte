<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import LoadingSpinner from '@components/loading-spinner/LoadingSpinner.svelte'
  import '../fonts.css'
  import { onMount } from 'svelte'
  let mounted = false

  onMount(() => {
    mounted = true
  })
</script>

<!-- enables SSR of css -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

{#if mounted}
  <Header />

  <div>
    {#if $navigating}
      {#await new Promise((resolve) => setTimeout(resolve, 200)) then}
        <center>
          <LoadingSpinner />
        </center>
      {/await}
    {:else}
      <slot />
    {/if}
  </div>
{/if}
