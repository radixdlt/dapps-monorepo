<script lang="ts">
  import TokenPlaceholderIcon from '@icons/token-placeholder.svg'
  import XrdTokenIcon from '@icons/xrd-token-icon.svg'
  import sanitizeHtml from 'sanitize-html'
  export let iconUrl = ''
  export let isXrd: boolean = false
  let imageNotFound = false
  let imageLoaded = false

  let sanitizedIconUrl = iconUrl ? sanitizeHtml(iconUrl) : ''

  $: resolvedIconUrl = isXrd
    ? XrdTokenIcon
    : imageNotFound
    ? TokenPlaceholderIcon
    : sanitizedIconUrl
</script>

<div
  class="token-icon"
  class:loaded={imageLoaded}
  style={`background-image: url(${resolvedIconUrl})`}
>
  {#if !imageNotFound || !imageLoaded}
    <img
      src={sanitizedIconUrl}
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
    width: 44px;
    height: 44px;
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
