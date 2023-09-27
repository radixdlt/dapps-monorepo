<script lang="ts">
  import type { NonFungibleAddress } from '@api/utils/nfts'
  import CopyableText from '@components/_base/copyable-text/CopyableText.svelte'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import { shortenNftID } from '@utils'

  export let imgUrl: string | undefined
  export let name: string | undefined
  export let address: NonFungibleAddress
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button class="card non-fungible-card" on:click>
  <div class="image">
    <NftImage url={imgUrl} --size="100%" />
  </div>

  <div class="text-area">
    <CopyableText
      value={address.id}
      copyableValue={address.nonFungibleAddress}
      shorten={{
        fn: shortenNftID,
        behavior: 'always'
      }}
      let:displayText
    >
      <div class="subtext">{displayText}</div>
    </CopyableText>

    {#if name}
      <div class="name">
        {name}
      </div>
    {/if}
  </div>
</button>

<style lang="scss">
  .image :global(.wrapper) {
    background: none;
    box-shadow: none;
  }
  .non-fungible-card {
    display: grid;
    grid: 5fr / 1fr;
    width: 15rem;
    height: 20rem;

    .image {
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    }

    .text-area {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
      padding: var(--spacing-xl);
    }
  }
</style>
