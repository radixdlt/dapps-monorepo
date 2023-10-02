<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import type { Entity } from '@api/utils/entities'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'

  export let entity: Promise<Entity>

  $: iconUrl = entity.then(
    (entity) => (entity.metadata.standard as any).icon_url?.value as string
  )

  $: name = entity.then(
    (entity) => (entity.metadata.standard as any).name?.value as string
  )

  $: description = entity.then(
    (entity) => (entity.metadata.standard as any).description?.value as string
  )

  $: symbol = entity.then(
    (entity) => (entity.metadata.standard as any).symbol?.value as string
  )
</script>

<div class="title">
  {#await Promise.all([iconUrl, name, symbol])}
    <SkeletonLoader />
  {:then [iconUrl, name, symbol]}
    {#if iconUrl}
      <NftImage url={iconUrl} />
    {/if}
    {#if name}
      <h2>
        {`${name} ${symbol ? `(${symbol})` : ''}`}
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
