<script lang="ts">
  import NonFungibleTokensPage from '@dashboard-pages/search-pages/account/non-fungible/NonFungibleTokensPage.svelte'
  import type { LayoutData } from '../$types'
  import { context } from '../+layout.svelte'

  export let data: LayoutData

  const activeTab = context.get('activeTab')
  $activeTab = 'nfts'
</script>

<NonFungibleTokensPage
  nonFungibleResources={data.promises.accountData.then(
    ({ nonFungible }) => nonFungible
  )}
/>
