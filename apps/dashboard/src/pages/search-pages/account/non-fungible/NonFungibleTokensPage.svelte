<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import {
    getNonFungiblesIdsPageWithData,
    type GetNonFungibleIdsPageWithDataRequest
  } from '@api/gateway'
  import type { TransformedNonFungible } from '@api/utils/entities/resource'
  import { transformNft } from '@api/utils/nfts'
  import type { GeneralNft } from '@api/utils/nfts/general-nft'
  import NFTAccordion from '@components/_base/accordion/NFTAccordion.svelte'
  import InfiniteScroll from '@components/infinite-scroll/InfiniteScroll.svelte'
  import NonFungibleTokenCard from '@components/non-fungible-token-card/NonFungibleTokenCard.svelte'
  import { createEventDispatcher } from 'svelte'

  export let nonFungibleResources: Promise<TransformedNonFungible[]>

  export let stateVersion: Promise<number>
  export let accountAddress: Promise<string>

  const loadedLaterNfts: Record<string, GeneralNft[]> = {}
  let isLoading = false

  let currentCursor: string | null | undefined = null

  $: data = Promise.all([stateVersion, accountAddress])

  let width: number

  const dispatch = createEventDispatcher<{
    'click-nft': { address: string }
  }>()

  const fetchMore = (data: GetNonFungibleIdsPageWithDataRequest) => {
    if (
      isLoading ||
      currentCursor === undefined ||
      (data.cursor === undefined && currentCursor === null)
    ) {
      return
    }
    isLoading = true

    getNonFungiblesIdsPageWithData({
      ...data,
      cursor: currentCursor || data.cursor
    }).then(([response, nftDataResponse]) => {
      currentCursor = response.next_cursor
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

  type GeneralNonFungibleResource = TransformedNonFungible & {
    nonFungibles: GeneralNft[]
  }

  const isClaimNftResource = (
    resource: TransformedNonFungible
  ): resource is GeneralNonFungibleResource =>
    resource.resource.metadata.nonStandard.some(
      (metadata) => metadata.key === 'validator'
    )

  const filterOutClaimNfts = (
    nonFungibleResources: Promise<TransformedNonFungible[]>
  ): Promise<GeneralNonFungibleResource[]> => {
    return nonFungibleResources.then((nonFungibleResources) => {
      return nonFungibleResources.filter(
        (resource) => !isClaimNftResource(resource)
      ) as GeneralNonFungibleResource[]
    })
  }
</script>

{#await filterOutClaimNfts(nonFungibleResources)}
  {#each Array(3) as _}
    <NFTAccordion data={new Promise(() => {})} />
  {/each}
{:then nonFungibleResources}
  {#each nonFungibleResources as { resource, nonFungibles, ownedNonFungibles, nextCursor, vaultAddress }}
    <NFTAccordion
      data={{
        name: resource.metadata.standard.name?.value,
        address: resource.address,
        imageUrl: resource.metadata.standard.icon_url?.value.href,
        count: ownedNonFungibles,
        tags: resource.metadata.standard.tags?.value,
        totalCount: Number(resource.totalSupply)
      }}
    >
      {#await data then [stateVersion, accountAddress]}
        <div bind:clientWidth={width}>
          <div class="nft-cards" class:center={width < 500}>
            {#each nonFungibles as { address, nftData: { standard: { name, key_image_url } } }}
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
              {#each loadedLaterNfts[resource.address] as { address, nftData: { standard: { key_image_url, name } } }}
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
          on:thresholdReached={() => {
            fetchMore({
              stateVersion,
              componentAddress: accountAddress,
              cursor: nextCursor,
              vaultAddress,
              resourceAddress: resource.address
            })
          }}
        />
        {#if isLoading}
          <div class="loader-spacing">
            <SkeletonLoader />
          </div>
        {/if}
      {/await}
    </NFTAccordion>
  {/each}
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
