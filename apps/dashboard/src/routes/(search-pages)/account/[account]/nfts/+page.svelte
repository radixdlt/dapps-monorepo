<script lang="ts">
  import NonFungibleTokensPage from '@dashboard-pages/search-pages/account/non-fungible/NonFungibleTokensPage.svelte'
  import type { LayoutData } from '../$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData
</script>

<NonFungibleTokensPage
  accountAddress={data.promises.accountData.then(
    ({ accountAddress }) => accountAddress
  )}
  stateVersion={data.promises.stateVersion}
  nonFungibleResources={data.promises.accountData.then(
    ({ nonFungible }) => nonFungible
  )}
  on:click-nft={({ detail: { address } }) =>
    goto(`/nft/${encodeURIComponent(address)}`)}
/>
