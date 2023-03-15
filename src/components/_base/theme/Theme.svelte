<script lang="ts">
  export let theme: 'light' | 'dark'
</script>

<div class={`${theme} common`}>
  <slot />
</div>

<style>
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
    --spacing-unit: 1em;
    --spacing-xs: calc(0.25 * var(--spacing-unit));
    --spacing-sm: calc(0.5 * var(--spacing-unit));
    --spacing-md: calc(0.75 * var(--spacing-unit));
    --spacing-lg: calc(1.25 * var(--spacing-unit));
    --spacing-xl: calc(2 * var(--spacing-unit));
    --spacing-2xl: calc(3.25 * var(--spacing-unit));
    --spacing-3xl: calc(5.25 * var(--spacing-unit));
  }

  /* typography */
  :global(body) {
    --font-family: 'IBM Plex Sans';
    --text-base-size: 1em;
    --text-scale-ratio: 1.2;

    --text-xs: calc(
      var(--text-base-size) /
        (var(--text-scale-ratio) * var(--text-scale-ratio))
    );
    --text-sm: calc(var(--text-xs) * var(--text-scale-ratio));
    --text-md: calc(var(--text-sm) * var(--text-scale-ratio));
    --text-lg: calc(var(--text-md) * var(--text-scale-ratio));
    --text-xl: calc(var(--text-lg) * var(--text-scale-ratio));
    --text-2xl: calc(var(--text-xl) * var(--text-scale-ratio));
    --text-3xl: calc(var(--text-2xl) * var(--text-scale-ratio));
  }

  /* themes */
  .light {
    --background: var(--color-secondary-light);
    --surface: var(--color-grey-4);
    --text-color: var(--color-grey-0);
  }
  .dark {
    --background: var(--color-tertiary-dark);
    --surface: var(--color-grey-0);
    --text-color: var(--color-grey-4);
  }

  /* common utilities */
  .common {
    --border: 0.15em solid var(--color-grey-1);
  }

  :global(body) {
    font-family: var(--font-family);
    font-size: var(--text-base-size);
  }
</style>
