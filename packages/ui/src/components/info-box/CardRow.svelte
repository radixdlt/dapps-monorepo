<script lang="ts">
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import Row from './Row.svelte'

  export let title: string
  export let cardInfo: { iconUrl: string; text: string }[]
</script>

<div class="card-row">
  <Row text={title}>
    <svelte:fragment slot="right">
      <div class="cards">
        {#each cardInfo as { iconUrl, text }}
          <div class="card dapp-card">
            <NftImage url={iconUrl} />

            <span class="card-text">{text}</span>
          </div>
        {/each}
      </div>
    </svelte:fragment>
  </Row>
</div>

<style lang="scss">
  @use '../../mixins.scss';

  .card-row {
    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    @include mixins.desktop {
      padding: 0.75rem 0;
    }

    @include mixins.mobile {
      padding: 1rem 0;
    }

    :global(.row) {
      @include mixins.desktop {
        flex-direction: column;
        align-items: baseline;
        gap: var(--spacing-lg);
      }
    }
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-lg);

    .dapp-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-xl);
      gap: var(--spacing-lg);
      width: 15rem;

      @include mixins.mobile {
        margin: auto;
      }

      .card-text {
        font-weight: var(--font-weight-bold-2);
      }
    }
  }
</style>
