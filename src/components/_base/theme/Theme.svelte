<script lang="ts">
  export let theme: 'light' | 'dark'
</script>

<div class={`${theme}`}>
  <slot />
</div>

<style>
  /* transitions */
  :global(body *) {
    transition: background-color 0.3s;
  }

  /* Radix colors */
  :global(body *) {
    /* Core colors */
    --color-primary-dark: '#00AB84';
    --color-primary-light: '#00C389';
    --color-secondary-dark: '#060F8F';
    --color-secondary-light: '#052CC0';
    --color-tertiary-dark: '#003057';
    --color-tertiary-light: '#FFFFFF';

    /*color- Accent colors */
    --color-accent-red: '#EF4136';
    --color-accent-blue: '#00AEEF';
    --color-accent-yellow: '#FFF200';

    /*color- Neutral colors */
    --color-grey-0: '#425563';
    --color-grey-1: '#4F758B';
    --color-grey-2: '#7A99AC';
    --color-grey-3: '#DDE5ED';
    --color-grey-4: '#F2F2FC';
  }

  :global(.light) {
    --background: var(--color-secondary-light);
  }

  :global(.dark) {
    --background: var(--color-tertiary-dark);
  }

  :global(body *) {
    --padding-small: 10px;
  }
</style>
