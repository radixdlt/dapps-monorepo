<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'
  import type { ErrorResponse } from '@radixdlt/babylon-gateway-api-sdk'

  export let data: LayoutData

  let error: ErrorResponse

  const isError = (tx: any): tx is { error: ErrorResponse } =>
    tx.error !== undefined

  data.promises.tx.then((tx) => {
    if (isError(tx)) error = tx.error
  })
</script>

{#if error}
  <ErrorPage status={error.code || 500} traceId={error.trace_id} />
{:else}
  <SearchPage
    title="Transaction"
    address={data ? data.address : ''}
    activeTab={data.pageName}
    menuItems={[
      [
        { id: 'details', label: 'Details' },
        { id: 'raw-receipt', label: 'Raw receipt' }
      ]
    ]}
    on:navigate={({ detail }) => goto(detail)}
  >
    <slot />
  </SearchPage>
{/if}
