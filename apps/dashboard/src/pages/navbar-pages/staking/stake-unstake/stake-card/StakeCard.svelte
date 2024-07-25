<div class="card add-stake-card">
  <div class="icon-and-info">
    {#if $$slots['icon']}
      <div class="icon">
        <slot name="icon" />
      </div>
    {/if}

    {#if $$slots['info']}
      <div style:padding-left={$$slots['icon'] ? '' : 'var(--spacing-2xl)'}>
        <slot name="info" />
      </div>
    {/if}
  </div>

  <slot name="token-amount-card" />
</div>

<style lang="scss">
  .add-stake-card {
    padding: var(--spacing-xl);
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
    justify-content: space-between;
     @include mixins.mobile {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-xl);
      }

    .icon-and-info {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;

      overflow: hidden;

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--spacing-lg);
      }
    }
  }
</style>
