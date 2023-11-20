<script lang="ts">
  import TokenPlaceholderIcon from '@icons/token-placeholder.svg'
  import XrdTokenIcon from '@icons/xrd-token-icon.svg'
  import { getSafeImageUrl } from '@utils/safe-image'
  import sanitizeHtml from 'sanitize-html'
  export let iconUrl = ''
  export let isXrd: boolean = false
  let imageNotFound = false
  let imageLoaded = false

  let sanitizedIconUrl = iconUrl ? sanitizeHtml(iconUrl) : ''

  const result = getSafeImageUrl({
    url: sanitizedIconUrl,
    width: 132,
    height: 132
  })

  const safeUrl = result.valid ? result.url : undefined

  $: resolvedIconUrl = isXrd
    ? XrdTokenIcon
    : imageNotFound || !iconUrl || iconUrl === ''
    ? TokenPlaceholderIcon
    : safeUrl
</script>

<div
  class="token-icon"
  class:loaded={imageLoaded}
  style={`background-image: url(${resolvedIconUrl})`}
>
  {#if !imageNotFound || !imageLoaded}
    <img
      src={safeUrl}
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

<style lang="scss">
  .token-icon {
    background: var(--color-grey-4);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: var(--size, 44px);
    height: var(--size, 44px);
    border-radius: 50%;
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
