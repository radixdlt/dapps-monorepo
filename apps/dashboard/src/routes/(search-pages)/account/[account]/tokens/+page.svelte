<script lang="ts">
  import type { FungibleResource } from '@api/utils/resources'
  import type { LayoutData } from '../$types'
  import type { Token } from '@dashboard-pages/search-pages/account/types'
  import FungibleTokensPage from '@dashboard-pages/search-pages/account/fungible/FungibleTokensPage.svelte'
  import { xrdAddress as xrdAddressStore } from '@stores'
  import { indexBy, prop } from 'ramda'
  import { context } from '../+layout.svelte'

  export let data: LayoutData

  const activeTab = context.get('activeTab')
  $activeTab = 'tokens'

  const transformFungibleTokenResource = ({
    address,
    value: amount,
    symbol,
    iconUrl,
    tags
  }: FungibleResource): Token => ({
    linksTo: `/resource/${address}`,
    numberOfTags: tags?.length ?? 0,
    amount,
    symbol,
    address,
    iconUrl
  })

  $: xrdAddress = $xrdAddressStore

  $: promise = xrdAddress
    ? data.promises.accountData.then(({ fungible }) => {
        const { [xrdAddress!]: xrdRaw, ...tokensRaw } = indexBy(
          prop('address'),
          fungible
        )
        const xrd = xrdRaw ? transformFungibleTokenResource(xrdRaw) : undefined
        const tokens = Object.values(tokensRaw).map(
          transformFungibleTokenResource
        )

        return { xrd, tokens }
      })
    : Promise.resolve(undefined)
</script>

<FungibleTokensPage
  data={promise.then((value) => ({
    tokens: value?.tokens ?? [],
    xrd: value?.xrd
  }))}
/>
