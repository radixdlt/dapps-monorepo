<script lang="ts">
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import { formatTokenValue } from '@utils'
  import Address from '@components/_base/address/Address.svelte'

  export let resourceAddress: string
  export let resourceName: string | undefined = undefined
  export let resourceIconUrl: string | undefined = undefined
  export let amount: string | number | undefined = undefined

  export let resourceSymbol: string | undefined = undefined

  export let nftName: string | undefined = undefined
  export let nftId: string | undefined = undefined
</script>

<div class="resource-proof-rule">
  <div class="resource-header">
    {#if nftId}
      <NftImage simple url={resourceIconUrl} --size="24px" />
    {:else}
      <TokenIcon iconUrl={resourceIconUrl} --size="24px" />
    {/if}

    <div class="dotted-overflow">
      {resourceSymbol || resourceName || nftName || ''}
    </div>

    <div class="amount dotted-overflow">
      {#if amount}
        {formatTokenValue(amount).displayValue}
      {:else}
        {nftName || 'ANY'}
      {/if}
    </div>
  </div>
  {#if nftId}
    <Address
      --background="var(--theme-surface-1)"
      value={`${resourceAddress}:${nftId}`}
      maxNftIdLength={22}
      short
    />
  {:else}
    <Address
      --background="var(--theme-surface-1)"
      value={resourceAddress}
      short
    />
  {/if}
</div>

<style>
  .resource-proof-rule {
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    background: var(--theme-surface-2);
    border: var(--border) var(--theme-border);
    height: fit-content;
    width: 335px;
    font-weight: var(--font-weight-bold-1);
  }

  .resource-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .amount {
    margin-left: auto;
  }
</style>
