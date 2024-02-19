<script lang="ts">
  import NftPlaceholder from '@icons/nft-placeholder.svg'
  import { getSafeImageUrl } from '@utils/safe-image'
  import sanitizeHtml from 'sanitize-html'

  export let url = ''
  export let size: 'small' | 'large' = 'small'
  export let width = 1024
  export let height = 1024
  export let defaultImageUrl: string | undefined = undefined
  export let simple: boolean = false

  let imageNotFound = false
  let imageLoaded = false

  $: {
    url
    imageNotFound = false
    imageLoaded = false
  }

  $: safeUrl = getSafeImageUrl({
    url: sanitizeHtml(url),
    width,
    height
  })

  $: resolvedIconUrl =
    imageNotFound || !safeUrl.valid
      ? defaultImageUrl ?? NftPlaceholder
      : safeUrl.url
</script>

<div class="wrapper {size}" class:simple>
  <div
    class="token-icon"
    class:loaded={imageLoaded}
    style={`background-image: url(${resolvedIconUrl})`}
  >
    {#if !imageNotFound || !imageLoaded}
      <img
        src={safeUrl.url}
        style="display: none;"
        alt="fungible token icon"
        on:load={() => {
          imageLoaded = true
        }}
        on:error={() => {
          imageNotFound = true
        }}
      />
    {/if}
  </div>
</div>

<style lang="scss">
  .wrapper {
    background: var(--theme-surface-2);
    padding: calc(var(--size, 3.25rem) / 13);
    border-radius: var(--border-radius-lg);
    width: var(--size, 3.25rem);
    height: var(--size, 3.25rem);
    min-width: var(--size, 3.25rem);
    min-height: var(--size, 3.25rem);
    box-shadow: var(--shadow);
    max-width: 100%;
    max-height: 100%;

    &.simple {
      padding: 0;
      border-radius: 0;
      box-shadow: none;
    }

    &.large {
      width: 19rem;
      height: 19rem;
      padding: 1rem;
    }

    @include mixins.desktop {
      &.large {
        width: 26rem;
        height: 26rem;
      }
    }
  }
  .token-icon {
    background: var(--theme-surface-2);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    display: flex;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
