<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import type { Entity } from '@api/utils/entities'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'

  export let entity: Promise<Entity>

  $: iconUrl = entity.then(
    (entity) =>
      (entity.metadata.expected as any).icon_url?.typed.value as string
  )

  $: name = entity.then(
    (entity) => entity.metadata.expected.name?.typed.value as string
  )

  $: description = entity.then(
    (entity) => entity.metadata.expected.description?.typed.value as string
  )

  $: symbol = entity.then(
    (entity) => (entity.metadata.expected as any).symbol?.typed.value as string
  )

  $: displayName = entity.then((entity) =>
    entity.type === 'resource' ? entity.displayName : undefined
  )
</script>

<div class="title">
  {#await Promise.all([iconUrl, name, symbol, displayName])}
    <SkeletonLoader />
  {:then [iconUrl, name, symbol, displayName]}
    {#if iconUrl}
      <NftImage url={iconUrl} />
    {/if}
    {#if name}
      <h2>
        {#if displayName}
          {displayName}
        {:else}
          {`${name} ${symbol ? `(${symbol})` : ''}`}
        {/if}
      </h2>
    {/if}
  {/await}
</div>

{#await description}
  <SkeletonLoader count={3} />
{:then description}
  {#if description}
    {description}
  {/if}
{/await}

<style>
  .title {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }
</style>
