<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { css, getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import LoadingSpinner from '@components/loading-spinner/LoadingSpinner.svelte'
  import '../fonts.css'
  import { onMount } from 'svelte'
  import Switch from '@components/switch/Switch.svelte'

  let darkModeEnabled: boolean

  let mounted = false
  onMount(() => {
    darkModeEnabled = localStorage.getItem('theme') === 'dark'
    mounted = true
  })

  $: {
    if (mounted) {
      localStorage.setItem('theme', darkModeEnabled ? 'dark' : 'light')
    }
  }
</script>

<!-- enables SSR of css -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

<Header />

<div
  class={css({
    position: 'fixed',
    top: '$sm',
    right: '$sm'
  })()}
>
  <Switch bind:enabled={darkModeEnabled} />
</div>

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
