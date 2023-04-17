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
    --color-radix-green-1: #00ab84;
    --color-radix-green-2: #00c389;
    --color-radix-green-3: #21ffbe;
    --color-radix-blue-1: #060f8f;
    --color-radix-blue-2: #052cc0;
    --color-radix-blue-3: #20e4ff;
    --color-light: #ffffff;
    /* Accent colors */
    --color-accent-red: #ef4136;
    --color-accent-blue: #00aeef;
    --color-accent-yellow: #fff200;
    --color-alert: #e59700;
    /* Neutral colors */
    --color-grey-1: #003057;
    --color-grey-2: #8a8fa4;
    --color-grey-3: #ced0d6;
    --color-grey-4: #e2e5ed;
    --color-grey-5: #f4f5f9;
  }
  /* spacing */
  :global(body) {
    --spacing-unit: 0.8em;
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
    --text-scale-ratio: 1.15;
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

    --font-weight-light: 400;
    --font-weight-bold-1: 500;
    --font-weight-bold-2: 600;
  }
  /* themes */
  .light {
    --background: var(--color-secondary-light);
    --surface: var(--color-grey-4);
    --text-color: var(--color-grey-1);
  }
  .dark {
    --background: var(--color-tertiary-dark);
    --surface: var(--color-grey-0);
    --text-color: var(--color-grey-4);
  }
  /* common utilities */
  :global(.common) {
    /* borders */
    --border-radius: 8px;
    --border-radius-small: 2px;
    --border: 1px solid var(--color-grey-4);
    --border-divider: 2px solid #e2e5ed70;

    /* shadows */
    --shadow: 0px 6.72099px 11px rgba(0, 0, 0, 0.06);
    --shadow-hover: 0px 6.72099px 11px rgba(0, 0, 0, 0.12);

    /* transitions */
    --transition-hover-card: all 0.2s ease-in-out;
    --transform-hover-card: translate(-0.2rem, -0.2rem);
  }

  /* global styles */
  :global(*) {
    font-family: var(--font-family);
    font-size: var(--text-base-size);
    color: var(--color-grey-1);
    box-sizing: border-box;
  }
  :global(a:link, a:visited, a:hover, a:active, input:hover, input:focus) {
    text-decoration: none;
  }
  :global(a) {
    color: var(--color-radix-blue-2);
    font-weight: var(--font-weight-bold-1);
    cursor: pointer;
  }
</style>
