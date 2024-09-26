<script lang="ts">
  import NonFungibleTokensPage from '@dashboard-pages/search-pages/account/non-fungible/NonFungibleTokensPage.svelte'
  import type { LayoutData } from '../$types'
  import { goto } from '$app/navigation'
  import type { GeneralNft } from '@api/utils/nfts/general-nft'

  export let data: LayoutData

  $: nfts = data.promises.nfts as Promise<GeneralNft[]>
</script>

<NonFungibleTokensPage
  account={data.promises.pool}
  stateVersion={data.promises.stateVersion}
  nonFungibleResources={data.promises.nonFungibleResources}
  {nfts}
  on:click-nft={({ detail: { address } }) =>
    goto(`/nft/${encodeURIComponent(address)}`)}
/>
