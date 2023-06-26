<script lang="ts">
</script>

<tr class="table-row">
  <slot />
</tr>

<style lang="scss">
  @use '../../../mixins.scss';
  tr.table-row {
    @include mixins.card;

    &:hover {
      box-shadow: var(--shadow-hover);
    }

    height: 84px;

    @include mixins.mobile {
      height: auto;
      display: flex;
      flex-direction: column;
      &:not(:last-child) {
        margin-bottom: 25px;
      }
    }

    :global(td) {
      border: var(--border) var(--theme-border);
      @include mixins.mobile {
        border-top: none;
        padding: 16px 24px;

        &:last-child {
          border-bottom: none;
        }
      }

      @include mixins.desktop {
        margin: 10px 0;
        padding: 10px 0;

        &:not(:first-child) {
          border-left: none;
        }

        &:not(:last-child) {
          border-right: none;
        }

        &:first-child {
          padding-left: 20px;
          border-top-left-radius: var(--border-radius-lg);
          border-bottom-left-radius: var(--border-radius-lg);
        }

        &:last-child {
          padding-right: 20px;
          border-top-right-radius: var(--border-radius-lg);
          border-bottom-right-radius: var(--border-radius-lg);
        }
      }
    }
  }
</style>
