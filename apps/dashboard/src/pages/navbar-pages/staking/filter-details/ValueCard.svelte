<script>
  import Card from '@svelte-ui/components/_base/card/Card.svelte'
</script>

<div>
  <Card --background="var(--color-grey-5)">
    <slot />
  </Card>
</div>

<style>
  div :global(#card) {
    --card-text-size: var(--font-size-sm);
    --card-text-color: var(--theme-subtext);
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
