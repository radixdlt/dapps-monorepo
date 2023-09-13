<script lang="ts">
  import type { FungibleResource } from '@api/utils/entities/resource'
  import type { LayoutData } from '../$types'
  import type { Token } from '@dashboard-pages/search-pages/account/types'
  import FungibleTokensPage from '@dashboard-pages/search-pages/account/fungible/FungibleTokensPage.svelte'
  import { xrdAddress as xrdAddressStore } from '@stores'
  import { indexBy, prop } from 'ramda'

  export let data: LayoutData

  const transformFungibleTokenResource = ({
    address,
    value: amount,
    metadata: {
      standard: { symbol, icon_url, tags }
    }
  }: FungibleResource): Token => ({
    linksTo: `/resource/${address}`,
    numberOfTags: tags?.value.length ?? 0,
    amount,
    symbol: symbol?.value,
    address,
    iconUrl: icon_url?.value.href
  })

  $: xrdAddress = $xrdAddressStore

  $: promise = xrdAddress
    ? data.promises.accountData.then(({ fungible }) => {
        const { [xrdAddress!]: xrdRaw, ...tokensRaw } = indexBy(
          prop('address'),
          fungible
        )
        const xrd = xrdRaw ? transformFungibleTokenResource(xrdRaw) : undefined
        const tokens = Object.values(tokensRaw)
          .filter(
            (fungibleResource) =>
              !fungibleResource.metadata.all.find(
                (metadata) =>
                  metadata.key === 'pool' || metadata.key === 'validator'
              )
          )
          .map(transformFungibleTokenResource)

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
