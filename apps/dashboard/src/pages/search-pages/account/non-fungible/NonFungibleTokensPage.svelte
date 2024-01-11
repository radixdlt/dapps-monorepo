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
  import NoTokens from '../NoTokens.svelte'
  import type {
    DefaultNonFungibleResource,
    NonFungibleResource
  } from '@api/utils/entities/resource/non-fungible/index'
  import type { ClaimNftCollection } from '@api/utils/entities/resource/non-fungible/claim-nft-collection'
  import type { Account } from '@api/utils/entities/component/account'

  export let nonFungibleResources: Promise<NonFungibleResource[]>
  export let nfts: Promise<GeneralNft[]>
  export let stateVersion: Promise<number>
  export let account: Promise<Account>

  const loadedLaterNfts: Record<string, GeneralNft[]> = {}
  let isLoading = false

  let currentCursor: string | null | undefined = null

  $: data = Promise.all([stateVersion, account, nfts])

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

  const isClaimNftResource = (
    resource: NonFungibleResource
  ): resource is ClaimNftCollection =>
    resource.nonFungibleType === 'claim-nft-collection'

  const filterOutClaimNfts = (
    nonFungibleResources: Promise<NonFungibleResource[]>
  ): Promise<DefaultNonFungibleResource[]> => {
    return nonFungibleResources.then((nonFungibleResources) => {
      return nonFungibleResources.filter(
        (resource) => !isClaimNftResource(resource)
      ) as DefaultNonFungibleResource[]
    })
  }
</script>

{#await Promise.all([filterOutClaimNfts(nonFungibleResources), data])}
  {#each Array(3) as _}
    <NFTAccordion data={new Promise(() => {})} />
  {/each}
{:then [nonFungibleResources, [stateVersion, account, nfts]]}
  {#if nonFungibleResources.length === 0}
    <NoTokens>No NFT's found</NoTokens>
  {:else}
    {#each nonFungibleResources as resource}
      {@const nonFungibles = nfts.filter(
        (nft) => nft.address.resourceAddress === resource.address
      )}

      {@const nbrOfNfts =
        account.resources.nonFungible
          .find((nonFungible) => nonFungible.address === resource.address)
          ?.vaults.map((vault) => vault.total_count)
          .reduce((a, b) => a + b, 0) ?? 0}

      {@const ownedNonFungible = account.resources.nonFungible.find(
        (nonFungible) => nonFungible.address === resource.address
      )}

      <NFTAccordion
        data={{
          name: resource.metadata.expected.name?.typed.value,
          address: resource.address,
          imageUrl: resource.metadata.expected.icon_url?.typed.value,
          count: nbrOfNfts,
          tags: resource.metadata.expected.tags?.typed.values,
          totalCount: Number(resource.totalSupply)
        }}
      >
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
              componentAddress: account.address,
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
