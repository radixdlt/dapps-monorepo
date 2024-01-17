<script lang="ts">
  import NftImage from '@svelte-ui/components/_base/nft-image/NftImage.svelte'
  import TokenIcon from '@svelte-ui/components/_base/token-icon/TokenIcon.svelte'
  import Cross from '@icons/cross-2.svg'
  import IconNew from '@svelte-ui/components/_base/icon/IconNew.svelte'
  import { formatTokenValue, shortenAddress } from '@common/utils/formatting'
  import SkeletonLoader from '@svelte-ui/components/_base/skeleton-loader/SkeletonLoader.svelte'

  export let resourceAddress: string
  export let iconUrl: Promise<string | undefined> | undefined
  export let name: Promise<string | undefined> | undefined
  export let nftId: string | undefined = undefined
  export let amount: string | number | undefined = undefined
</script>

<a
  href={nftId
    ? `/resource/${resourceAddress}:${nftId}`
    : `/resource/${resourceAddress}`}
  class="resource-proof-rule"
>
  {#if amount}
    <div class="amount">
      <h2 style:margin-bottom="2px">{formatTokenValue(amount).displayValue}</h2>
      <IconNew icon={Cross} />
    </div>
  {/if}
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
    border-radius: var(--border-radius-xl);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    border: var(--border) var(--theme-border);
    height: fit-content;
    width: fit-content;
    backdrop-filter: brightness(95%);
  }

  .amount {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }
</style>
