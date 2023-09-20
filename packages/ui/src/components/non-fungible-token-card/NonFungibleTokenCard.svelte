<script lang="ts">
  import type { NonFungibleAddress } from '@api/utils/nfts'
  import CopyableText from '@components/_base/copyable-text/CopyableText.svelte'
  import { shortenNftID } from '@utils'
  import { getSafeImageUrl } from '@utils/safe-image'

  export let imgUrl: string | undefined
  export let name: string | undefined
  export let address: NonFungibleAddress

  const dimension = 420

  const result = getSafeImageUrl({
    url: imgUrl,
    width: dimension,
    height: dimension
  })
  const placeholder = getSafeImageUrl({
    url: `https://via.placeholder.com/${dimension}x${dimension}?text=No+image`,
    width: dimension,
    height: dimension
  })

  const safeUrl = result.valid ? result.url : placeholder.url
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button class="card non-fungible-card" on:click>
  {#if safeUrl}
    <img class="image" src={safeUrl} alt="nft" />
  {/if}

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
  .non-fungible-card {
    display: grid;
    grid: 5fr / 1fr;
    width: 15rem;

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
