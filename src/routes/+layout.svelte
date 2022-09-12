<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { getCssText } from '@styles'
  import { navigating } from '$app/stores'
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
      <slot />
    {:else}
      <slot />
    {/if}
  </div>
{/if}
