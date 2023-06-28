<script lang="ts">
  import NftPlaceholder from '@icons/nft-placeholder.svg'
  export let url = ''
  export let size: 'small' | 'large' = 'small'

  let imageNotFound = false
  let imageLoaded = false

  $: resolvedIconUrl = imageNotFound ? NftPlaceholder : url
</script>

<div class="wrapper {size}">
  <div
    class="token-icon"
    class:loaded={imageLoaded}
    style={`background-image: url(${resolvedIconUrl})`}
  >
    {#if !imageNotFound || !imageLoaded}
      <img
        src={url}
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
    padding: 0.25rem;
    border-radius: var(--border-radius-lg);
    width: 3.25rem;
    height: 3.25rem;
    box-shadow: var(--shadow);
    max-width: 100%;
    max-height: 100%;

    &.large {
      width: 26rem;
      height: 26rem;
      padding: 1rem;
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