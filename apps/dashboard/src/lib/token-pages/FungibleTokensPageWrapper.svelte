<script lang="ts">
  import { xrdAddress as xrdAddressStore } from '@stores'
  import { indexBy, prop } from 'ramda'
  import type { FungibleResource } from '@api/utils/entities/resource/fungible'
  import type { Account } from '@api/utils/entities/component/account'
  import type { standardMetadata } from '@api/utils/metadata'
  import type { Component } from '@api/utils/entities/component'
  import FungibleTokensPage from './FungibleTokensPage.svelte'
  import type { Token } from './types'

  export let data: {
    promises: {
      fungibleResources: Promise<FungibleResource[]>
      entity: Promise<Account | Component<unknown, typeof standardMetadata>>
    }
  }

  const transformFungibleTokenResource =
    (account: Account) =>
    ({
      address,
      metadata: {
        expected: { symbol, icon_url, tags, name }
      }
    }: FungibleResource): Token => ({
      linksTo: `/resource/${address}`,
      numberOfTags: tags?.typed.values.length ?? 0,
      amount: account.resources.fungible.find(
        (fungible) => fungible.address === address
      )!.value,
      name: name?.typed?.value,
      symbol: symbol?.typed.value,
      address,
      iconUrl: icon_url?.typed.value
    })

  $: xrdAddress = $xrdAddressStore

  $: promise = xrdAddress
    ? Promise.all([data.promises.entity, data.promises.fungibleResources]).then(
        ([account, fungibles]) => {
          const { [xrdAddress!]: xrdRaw, ...tokensRaw } = indexBy(
            prop('address'),
            fungibles
          )

          const xrd = xrdRaw
            ? transformFungibleTokenResource(account as any)(xrdRaw)
            : undefined
          const tokens = Object.values(tokensRaw)
            .filter(
              (fungibleResource) =>
                !fungibleResource.metadata.all.find((metadata) => {
                  if (metadata.key === 'pool') {
                    if (
                      metadata.value.typed.type === 'GlobalAddress' &&
                      metadata.value.typed.value.startsWith('pool_')
                    ) {
                      return true
                    }
                  }

                  if (metadata.key === 'validator') {
                    if (
                      metadata.value.typed.type === 'GlobalAddress' &&
                      metadata.value.typed.value.startsWith('validator_')
                    ) {
                      return true
                    }
                  }

                  return false
                })
            )
            .map(transformFungibleTokenResource(account as any))

          return { xrd, tokens }
        }
      )
    : Promise.resolve(undefined)
</script>

<FungibleTokensPage
  data={promise.then((value) => ({
    tokens: value?.tokens ?? [],
    xrd: value?.xrd
  }))}
/>
