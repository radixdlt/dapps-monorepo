<script lang="ts">
  import type { FungibleResource } from '@api/utils/resources'
  import type { PageData } from './$types'
  import type { Token } from '@dashboard-pages/search-pages/account/types'
  import FungibleTokensPage from '@dashboard-pages/search-pages/account/FungibleTokensPage.svelte'
  import { xrdAddress as xrdAddressStore } from '@stores'
  import { indexBy, prop } from 'ramda'
  import { goto } from '$app/navigation'

  export let data: PageData

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
    ? data.promises.account
        .then((arr) => arr[0])
        .then((details) => {
          const { [xrdAddress!]: xrdRaw, ...tokensRaw } = indexBy(
            prop('address'),
            details.fungible
          )
          const xrd = xrdRaw
            ? transformFungibleTokenResource(xrdRaw)
            : undefined
          const tokens = Object.values(tokensRaw).map(
            transformFungibleTokenResource
          )

          return { xrd, tokens }
        })
        .catch(() => {
          goto('/not-found')
        })
    : Promise.resolve(undefined)
</script>

{#await promise}
  <FungibleTokensPage loading={true} />
{:then value}
  {#if value}
    <FungibleTokensPage xrd={value.xrd} tokens={value.tokens} />
  {/if}
{:catch}
  <!-- INVALID ACCOUNT -->
{/await}
