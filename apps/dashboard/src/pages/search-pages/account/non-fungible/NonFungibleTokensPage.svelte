<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import {
    getNonFungiblesIdsPageWithData,
    type GetNonFungibleIdsPageWithDataRequest
  } from '@api/_deprecated/gateway'
  import { transformNft } from '@api/utils/nfts'
  import type { GeneralNft } from '@api/utils/nfts/general-nft'
  import NFTAccordion from '@components/_base/accordion/NFTAccordion.svelte'
  import InfiniteScroll from '@components/infinite-scroll/InfiniteScroll.svelte'
  import NonFungibleTokenCard from '@components/non-fungible-token-card/NonFungibleTokenCard.svelte'
  import { createEventDispatcher } from 'svelte'
  import type {
    DefaultNonFungibleResource,
    NonFungibleResource
  } from '@api/utils/entities/resource/non-fungible/index'
  import type { Account } from '@api/utils/entities/component/account'
  import { groupBy } from '@common/groupBy'
  import { keyBy } from '@common/keyBy'
  import type { EntityNonFungible } from '@api/utils/entities'
  import type { standardMetadata } from '@api/utils/metadata'
  import type { Component } from '@api/utils/entities/component'
    import NoTokens from '@dashboard/lib/token-pages/NoTokens.svelte'

  export let nonFungibleResources: Promise<NonFungibleResource[]>
  export let nfts: Promise<GeneralNft[]>
  export let stateVersion: Promise<number>
  export let account: Promise<
    Account | Component<unknown, typeof standardMetadata>
  >

  const loadedLaterNfts: Record<string, GeneralNft[]> = {}
  let isLoading = false

  let currentCursors: Record<string, string | null | undefined> = {}

  $: {
    nonFungibleResources.then((data) => {
      data.forEach((resource) => {
        currentCursors[resource.address] = null
      })
    })
  }

  $: data = Promise.all([
    nonFungibleResources,
    stateVersion,
    account,
    nfts
  ]).then(([nonFungibleResources, stateVersion, account, nfts]) => {
    const nftsMap = groupBy(
      nfts,
      (nft: GeneralNft) => nft.address.resourceAddress
    )
    const accountResourceMap = keyBy(
      account.resources.nonFungible,
      (res) => res.address
    )
    const filteredNonFungibleResources = nonFungibleResources.filter(
      (resource) => {
        return (
          resource.nonFungibleType !== 'claim-nft-collection' &&
          resource.totalSupply !== '0' &&
          nftsMap[resource.address]
        )
      }
    ) as DefaultNonFungibleResource[]

    return [
      filteredNonFungibleResources,
      stateVersion,
      account.address,
      accountResourceMap,
      nftsMap
    ] as [
      DefaultNonFungibleResource[],
      number,
      string,
      Record<string, EntityNonFungible>,
      Record<string, GeneralNft[]>
    ]
  })

  let width: number

  const dispatch = createEventDispatcher<{
    'click-nft': { address: string }
  }>()

  const fetchMore = (data: GetNonFungibleIdsPageWithDataRequest) => {
    if (
      isLoading ||
      currentCursors[data.resourceAddress] === undefined ||
      (data.cursor === undefined &&
        currentCursors[data.resourceAddress] === null)
    ) {
      return
    }
    isLoading = true

    getNonFungiblesIdsPageWithData({
      ...data,
      cursor: currentCursors[data.resourceAddress] || data.cursor
    }).then(([response, nftDataResponse]) => {
      currentCursors[data.resourceAddress] = response.next_cursor
      if (!loadedLaterNfts[data.resourceAddress]) {
        loadedLaterNfts[data.resourceAddress] = []
      }
      loadedLaterNfts[data.resourceAddress] = [
        ...loadedLaterNfts[data.resourceAddress],
        ...nftDataResponse.map(
          (singleNftData) =>
            transformNft(data.resourceAddress, singleNftData) as GeneralNft
        )
      ]
      isLoading = false
    })
  }
</script>

{#await data}
  {#each Array(3) as _}
    <NFTAccordion data={new Promise(() => {})} />
  {/each}
{:then [nonFungibleResources, stateVersion, accountAddress, accountResourceMap, nftsMap]}
  {#if nonFungibleResources.length === 0}
    <NoTokens>No NFTs found</NoTokens>
  {:else}
    {#each nonFungibleResources as resource}
      {@const ownedNonFungible = accountResourceMap[resource.address]}

      <NFTAccordion
        data={{
          name: resource.metadata.expected.name?.typed.value,
          address: resource.address,
          imageUrl: resource.metadata.expected.icon_url?.typed.value,
          count: ownedNonFungible.nbrOfNfts,
          tags: resource.metadata.expected.tags?.typed.values,
          totalCount: Number(resource.totalSupply)
        }}
      >
        <div bind:clientWidth={width}>
          <div class="nft-cards" class:center={width < 500}>
            {#each nftsMap[resource.address] as { address, nftData: { expected: { name, key_image_url } } }}
              <NonFungibleTokenCard
                imgUrl={key_image_url?.value}
                name={name?.value}
                {address}
                on:click={() =>
                  dispatch('click-nft', {
                    address: address.nonFungibleAddress
                  })}
              />
            {/each}
            {#if loadedLaterNfts[resource.address]}
              {#each loadedLaterNfts[resource.address] as { address, nftData: { expected: { key_image_url, name } } }}
                <NonFungibleTokenCard
                  imgUrl={key_image_url?.value}
                  name={name?.value}
                  {address}
                  on:click={() =>
                    dispatch('click-nft', {
                      address: address.nonFungibleAddress
                    })}
                />
              {/each}
            {/if}
          </div>
        </div>

        <InfiniteScroll
          middlePageMode={true}
          on:thresholdReached={() => {
            fetchMore({
              stateVersion,
              componentAddress: accountAddress,
              cursor: ownedNonFungible?.vaults[0].next_cursor ?? undefined,
              vaultAddress: ownedNonFungible?.vaults[0].vault_address ?? '',
              resourceAddress: resource.address
            })
          }}
        />
        {#if isLoading}
          <div class="loader-spacing">
            <SkeletonLoader />
          </div>
        {/if}
      </NFTAccordion>
    {/each}
  {/if}
{/await}

<style>
  .nft-cards {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2xl);
  }

  .center {
    display: flex;
    justify-content: center;
  }

  .loader-spacing {
    margin: var(--space-lg) auto;
  }
</style>
