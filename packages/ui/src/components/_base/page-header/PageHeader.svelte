<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import PillsMenu from '@components/_base/pills-menu/PillsMenu.svelte'

  export let activeTab: string
  export let address: string | undefined
  export let menuItems: { id: string; label: string }[][] = [[]]
  export let onMenuClick = (id: string) => {}
</script>

<h1><slot /></h1>

<Address value={address} autoShorten --background="var(--color-grey-4)" />

<PillsMenu
  active={activeTab}
  items={menuItems}
  onClick={(id) => onMenuClick(id)}
  --margin="2rem 0"
/>
