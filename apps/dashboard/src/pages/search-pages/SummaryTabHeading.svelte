<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { Entity } from '@api/utils/entities'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'

  export let entity: Promise<Entity>

  $: iconUrl = entity.then((entity) =>
    entity.type === 'resource' || entity.type === 'validator'
      ? entity.metadata.standard.iconUrl?.value
      : undefined
  )

  $: name = entity.then((entity) =>
    entity.type === 'resource' ||
    entity.type === 'validator' ||
    entity.type === 'package' ||
    entity.type === 'component'
      ? entity.metadata.standard.name?.value
      : undefined
  )

  $: description = entity.then((entity) =>
    entity.type === 'resource' ||
    entity.type === 'validator' ||
    entity.type === 'package' ||
    entity.type === 'component'
      ? entity.metadata.standard.description?.value
      : undefined
  )

  $: symbol = entity.then((entity) =>
    entity.type === 'resource'
      ? entity.metadata.standard.symbol?.value
      : undefined
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
