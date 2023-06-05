<script>
  import CardNew from '@components/_base/card/CardNew.svelte'
</script>

<div>
  <CardNew --background="var(--color-grey-5)">
    <slot />
  </CardNew>
</div>

<style>
  div :global(#card) {
    --card-text-size: var(--font-size-sm);
    --card-text-color: var(--color-grey-2);
    --card-value-size: var(--text-3xl);
    --card-value-weight: var(--font-weight-bold-2);

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-xl);
    width: 100%;
    height: 10rem;
  }
</style>
