<script lang="ts">
  import CopyableText from '@components/_base/copyable-text/CopyableText.svelte'

  export let imgUrl: string | undefined
  export let name: string | undefined
  export let id: string
</script>

<div class="card">
  {#if imgUrl}
    <img
      class="image"
      src={imgUrl
        ? imgUrl
        : 'https://via.placeholder.com/300x300?text=No+image'}
      alt="nft"
    />
  {/if}

  <div class="text-area">
    <CopyableText value={id}>
      <div class="subtext">{id}</div>
    </CopyableText>

    {#if name}
      <div class="name">
        {name}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../../../packages/ui/src/mixins.scss';

  .card {
    @include mixins.card;

    display: grid;
    grid: 5fr / 1fr;
    width: 15rem;

    .image {
      width: 15rem;
      height: 15rem;
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
