<script lang="ts">
  export let theme: 'light'
</script>

<div class={`${theme} common`}>
  <slot />
</div>

<style>
  .light {
    --theme-surface-1: var(--color-grey-5);
    --theme-surface-2: var(--color-light);
    --theme-surface-3: var(--color-grey-4);

    --theme-text-primary: var(--color-grey-1);
    --theme-text-secondary: var(--color-light);
    --theme-subtext: var(--color-grey-2);

    --theme-success-primary: var(--color-radix-green-2);

    --theme-error-primary: var(--color-radix-error-red-1);
    --theme-error-secondary: var(--color-radix-error-red-2);

    --theme-border: var(--color-grey-4);
    --theme-border-strong: var(--color-grey-1);

    --theme-button-primary: var(--color-radix-blue-2);
  }

  :global(*) {
    color: var(--theme-text-primary);
  }

  :global(a) {
    color: var(--theme-button-primary);
  }

  :global(.text-success) {
    color: var(--theme-success-primary);
  }

  :global(.text-error) {
    color: var(--theme-error-primary);
  }

  :global(.surface-2) {
    background: var(--theme-surface-2);
  }
</style>
