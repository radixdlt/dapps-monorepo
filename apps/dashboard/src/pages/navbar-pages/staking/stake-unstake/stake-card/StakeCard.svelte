<div class="add-stake-card">
  <div class="icon">
    <slot name="icon" />
  </div>

  <slot name="info" />

  <slot name="token-amount-card" />
</div>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .add-stake-card {
    @include mixins.card;
    padding: var(--spacing-xl);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) var(
        --token-amount-card-width,
        1fr
      );
    gap: var(--spacing-lg);
    align-items: center;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-lg);
    }
  }
</style>
