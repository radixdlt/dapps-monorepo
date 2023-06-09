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
  }
  .dark {
    --background: var(--color-tertiary-dark);
    --surface: var(--color-grey-0);
    --text-color: var(--color-grey-4);
  }
</style>
