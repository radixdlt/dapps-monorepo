<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'
  import type { ComponentProps } from 'svelte'

  export let data: LayoutData

  let error: ComponentProps<ErrorPage>['status']

  data.promises.accountData.catch((e) => {
    error = e.status
  })
</script>

{#if error}
  <ErrorPage status={error} />
{:else}
  <SearchPage
    --border="var(--theme-border-separator)"
    title="Account"
    address={data.address}
    activeTab={data.pageName}
    menuItems={[
      [
        { id: 'tokens', label: 'Tokens' },
        { id: 'nfts', label: 'NFTs' },
        { id: 'pool-units', label: 'Pool Units' }
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
