<script lang="ts">
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import { formatTokenValue, shortenAddress } from '@utils'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'

  export let resourceAddress: string
  export let iconUrl: string | undefined
  export let name: string | undefined
  export let nftId: string | undefined = undefined
  export let amount: string | number | undefined = undefined
</script>

<a
  href={nftId
    ? `/resource/${encodeURIComponent(`${resourceAddress}:${nftId}`)}`
    : `/resource/${resourceAddress}`}
  class="resource-proof-rule"
>
  {#if nftId}
    {#await iconUrl}
      <NftImage --size="35px" />
    {:then url}
      <NftImage {url} --size="35px" />
    {/await}
  {:else}
    {#await iconUrl}
      <TokenIcon --size="35px" />
    {:then iconUrl}
      <TokenIcon {iconUrl} --size="35px" />
    {/await}
  {/if}
  {#if amount}
    <div class="amount">
      {formatTokenValue(amount).displayValue}
    </div>
  {/if}
  <div>
    {#if name}
      {#await name}
        <SkeletonLoader />
      {:then name}
        {name ?? shortenAddress(resourceAddress)}
      {/await}
    {:else}
      {name ?? shortenAddress(resourceAddress)}
    {/if}
  </div>
</a>

<style>
  .resource-proof-rule {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    background: var(--theme-surface-2);
    border: var(--border) var(--theme-border);
    height: fit-content;
  }

  .amount {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }
</style>
