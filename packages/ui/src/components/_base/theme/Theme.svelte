<script lang="ts">
  export let theme: 'light' | 'dark'
</script>

<div class={`${theme} common`}>
  <slot />
</div>

<style>
  .light {
    --background: var(--color-light);
    --surface: var(--color-grey-5);
    --text-color: var(--color-grey-1);
    --subtext-color: var(--color-grey-2);
    --error-dark: var(--color-radix-error-red-1);
    --error-light: var(--color-radix-error-red-2);
    --border: var(--color-grey-3);

    /* Pills menu */
    --pills-menu-item-active-background: var(--color-grey-1);
    --pills-menu-item-active-text: var(--color-grey-5);
    --pills-menu-item-hover-background: var(--color-grey-4);
  }
  .dark {
    --background: var(--color-tertiary-dark);
    --surface: var(--color-grey-0);
    --text-color: var(--color-grey-4);
  }
</style>
