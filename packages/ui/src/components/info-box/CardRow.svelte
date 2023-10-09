<script lang="ts">
  import Row from './Row.svelte'

  export let title: string
</script>

<div class="card-row">
  <Row text={title}>
    <svelte:fragment slot="right">
      <slot />
    </svelte:fragment>
  </Row>
</div>

<style lang="scss">
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
</style>
