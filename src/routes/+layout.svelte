<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { darkTheme, getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import LoadingSpinner from '@components/loading-spinner/LoadingSpinner.svelte'
  import '../fonts.css'
  import { onMount } from 'svelte'
  import { storage } from '@stores'

  let mounted = false

  onMount(() => {
    mounted = true

    storage.subscribe((storage) =>
      document.body.classList[storage.theme === 'dark' ? 'add' : 'remove'](
        darkTheme
      )
    )
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
