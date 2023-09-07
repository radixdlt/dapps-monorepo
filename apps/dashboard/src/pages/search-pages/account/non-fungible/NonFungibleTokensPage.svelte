<script lang="ts">
  import type {
    NonFungible,
    NonFungibleResource
  } from '@api/utils/entities/resource'
  import NFTAccordion from '@components/_base/accordion/NFTAccordion.svelte'
  import NonFungibleTokenCard from '@components/non-fungible-token-card/NonFungibleTokenCard.svelte'
  import { createEventDispatcher } from 'svelte'

  export let nonFungibleResources: Promise<
    {
      resource: NonFungibleResource
      totalNonFungibles: number
      nonFungibles: NonFungible[]
    }[]
  >

  let width: number

  const dispatch = createEventDispatcher<{
    'click-nft': { address: string }
  }>()
</script>

{#await nonFungibleResources}
  {#each Array(3) as _}
    <NFTAccordion data={new Promise(() => {})} />
  {/each}
{:then nonFungibleResources}
  {#each nonFungibleResources as { resource, nonFungibles, totalNonFungibles }}
    <NFTAccordion
      data={{
        name: resource.metadata.standard.name?.value,
        address: resource.address,
        imageUrl: resource.metadata.standard.iconUrl?.value,
        count: nonFungibles.length,
        tags: resource.metadata.standard.tags?.value,
        totalCount: totalNonFungibles
      }}
    >
      <div bind:clientWidth={width}>
        <div class="nft-cards" class:center={width < 500}>
          {#each nonFungibles as { address, nftData: { standard: { iconUrl, name } } }}
            <NonFungibleTokenCard
              imgUrl={iconUrl}
              {name}
              {address}
              on:click={() =>
                dispatch('click-nft', {
                  address: address.nonFungibleAddress
                })}
            />
          {/each}
        </div>
      </div>
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
</style>
