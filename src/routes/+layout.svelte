<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { darkTheme, getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import '../fonts.css'
  import { onMount } from 'svelte'
  import { storage } from '@stores'

  let mounted = false

  onMount(() => {
    mounted = true
  })

  $: if (mounted) {
    document.body.classList[$storage.theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }
</script>

<!-- enables SSR of css -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

{#if mounted}
  <Header />

  <div>
    {#if $navigating}
      <slot />
    {:else}
      <slot />
    {/if}
  </div>
{/if}
