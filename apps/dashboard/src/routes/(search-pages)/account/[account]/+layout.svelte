<script context="module" lang="ts">
  export const context = useContext<{
    activeTab: Writable<string>
  }>()
</script>

<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import { useContext } from '@utils'
  import { writable, type Writable } from 'svelte/store'

  export let data: LayoutData

  context.set('activeTab', writable('tokens'))
  const activeTab = context.get('activeTab')

  let notFound = false

  data.promises.accountData.catch(() => (notFound = true))

  goto(`/account/${data.address}/${$activeTab}`)
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage
    --border="var(--theme-border-separator)"
    title="Account"
    address={data.address}
    activeTab={$activeTab}
    menuItems={[
      [
        { id: 'tokens', label: 'Tokens' },
        { id: 'nfts', label: 'NFTs' }
      ],
      [
        { id: 'recent-transactions', label: 'Recent Transactions' },
        { id: 'metadata', label: 'Metadata' }
      ]
    ]}
    on:navigate={({ detail }) => goto(detail)}
  >
    <slot />
  </SearchPage>
{/if}
