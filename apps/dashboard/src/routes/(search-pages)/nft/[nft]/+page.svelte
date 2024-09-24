<script lang="ts">
  import NonFungible from '@dashboard-pages/search-pages/nft/Nft.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#await data.promises.nft then nft}
  <SearchPage
    title={nft?.type === 'claimNft'
      ? 'Radix Network Stake Claim Non-fungible'
      : 'Non Fungible'}
    address={data.nftAddress}
  >
    <NonFungible
      nft={data.promises.nft}
      resource={data.promises.resource}
      associatedDapps={data.promises.associatedDapps}
    />
  </SearchPage>
{/await}
