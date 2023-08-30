<tr class="card table-row" on:click>
  <slot />
</tr>

<style lang="scss">
  @use '../../../../mixins.scss';

  .table-row {
    &:hover {
      box-shadow: var(--shadow-hover);
    }

    transition: var(--transition-hover-card);
    height: 4rem;

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
          border-top-left-radius: var(--border-radius-lg);
          border-bottom-left-radius: var(--border-radius-lg);
          padding-left: var(--spacing-xl);
        }

        &:last-child {
          border-top-right-radius: var(--border-radius-lg);
          border-bottom-right-radius: var(--border-radius-lg);
          padding-right: var(--spacing-xl);
        }
      }
    }
  }
</style>
