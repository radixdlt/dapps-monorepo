<script lang="ts">
  export let theme: 'light' | 'dark'
</script>

<div class={`${theme} common`}>
  <slot />
</div>

<style>
  /* transitions */
  :global(body) {
    transition: background-color 0.3s;
  }

  /* Radix colors */
  :global(body) {
    /* Core colors */
    --color-primary-dark: #00ab84;
    --color-primary-light: #00c389;
    --color-secondary-dark: #060f8f;
    --color-secondary-light: #052cc0;
    --color-tertiary-dark: #003057;
    --color-tertiary-light: #ffffff;

    /* Accent colors */
    --color-accent-red: #ef4136;
    --color-accent-blue: #00aeef;
    --color-accent-yellow: #fff200;

    /* Neutral colors */
    --color-grey-0: #425563;
    --color-grey-1: #4f758b;
    --color-grey-2: #7a99ac;
    --color-grey-3: #dde5ed;
    --color-grey-4: #f2f2fc;
  }
  
  /* spacing */
  :global(body) {
    --padding-small: 10px;
  }

  /* themes */
  .light {
    --background: var(--color-secondary-light);
  }

  .dark {
    --background: var(--color-tertiary-dark);
  }
</style>
