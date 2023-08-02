<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import PillsMenu from '@components/_base/pills-menu/PillsMenu.svelte'
  import { createEventDispatcher } from 'svelte'

  export let title: string
  export let address: string
  export let menuItems: { id: string; label: string }[][] = []
  export let activeTab: string = ''

  const dispatch = createEventDispatcher()
</script>

<section class="search-page">
  <h1>{title}</h1>

  <Address value={address} autoShorten --background="var(--theme-surface-3)" />

  {#if menuItems.length > 0}
    <PillsMenu
      active={activeTab}
      items={menuItems}
      onClick={(id) => dispatch('navigate', id)}
      --margin="2rem 0"
    />
  {/if}
  <slot />
</section>
