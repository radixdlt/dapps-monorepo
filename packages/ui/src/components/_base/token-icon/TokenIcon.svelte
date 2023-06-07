<script>
  export let iconUrl = ''
  let imageNotFound = false
  let imageLoaded = false
</script>

<div class="token-icon" class:loaded={imageLoaded}>
  {#if !imageNotFound}
    <img
      src={iconUrl}
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
    width: 44px;
    height: 44px;
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    display: flex;
    align-items: center;
    &.loaded {
      border-radius: 50%;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
