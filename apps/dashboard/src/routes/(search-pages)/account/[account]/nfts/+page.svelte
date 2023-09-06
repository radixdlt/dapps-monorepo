<script lang="ts">
  import NonFungibleTokensPage from '@dashboard-pages/search-pages/account/non-fungible/NonFungibleTokensPage.svelte'
  import type { LayoutData } from '../$types'
  import { goto } from '$app/navigation'
  import { activeTab } from '../+layout.svelte'

  export let data: LayoutData

  $activeTab = 'nfts'
</script>

<NonFungibleTokensPage
  nonFungibleResources={data.promises.accountData.then(
    ({ nonFungible }) => nonFungible
  )}
  on:click-nft={({ detail: { address } }) =>
    goto(`/nft/${encodeURIComponent(address)}`)}
/>
