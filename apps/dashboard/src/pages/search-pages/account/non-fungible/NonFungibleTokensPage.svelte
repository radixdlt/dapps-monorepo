<script lang="ts">
  import type { NonFungible, NonFungibleResource } from '@api/utils/resources'
  import NFTAccordion from '@components/_base/accordion/NFTAccordion.svelte'
  import NonFungibleTokenCard from '@components/non-fungible-token-card/NonFungibleTokenCard.svelte'

  export let nonFungibleResources: Promise<
    {
      resource: NonFungibleResource
      totalNonFungibles: number
      nonFungibles: NonFungible[]
    }[]
  >
</script>

{#await nonFungibleResources}
  {#each Array(3) as _}
    <NFTAccordion data={new Promise(() => {})} />
  {/each}
{:then nonFungibleResources}
  {#each nonFungibleResources as { resource, nonFungibles, totalNonFungibles }}
    <NFTAccordion
      data={{
        name: resource.name,
        address: resource.address,
        imageUrl: resource.iconUrl,
        count: nonFungibles.length,
        tags: resource.tags,
        totalCount: totalNonFungibles
      }}
    >
      <div class="nft-cards">
        {#each nonFungibles as nft}
          <NonFungibleTokenCard
            imgUrl={nft.iconUrl}
            name={nft.name}
            id={nft.id}
          />
        {/each}
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
</style>
