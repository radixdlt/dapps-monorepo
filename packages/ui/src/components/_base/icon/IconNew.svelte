<script lang="ts">
  export let icon: string
  export let size: 'small' | 'medium' | 'large' = 'medium'
  export let faded = false
  export let rounded = false
  export let centered = false
</script>

<img
  class={size}
  class:centered
  class:faded
  class:rounded
  on:click
  src={icon}
  alt="icon"
/>

<style lang="scss">
  img {
    display: block;

    &.centered {
      margin: 0 auto;
    }
  }

  .faded {
    filter: grayscale(100%);
    opacity: 50%;
  }

  .small {
    width: var(--size, 0.75rem);
    height: var(--size, 0.75rem);

    &.rounded {
      border-radius: var(--border-radius-sm);
    }
  }
  .medium {
    width: var(--size, 1rem);
    height: var(--size, 1rem);

    &.rounded {
      border-radius: var(--border-radius-md);
    }
  }

  .large {
    width: var(--size, 3rem);
    height: var(--size, 3rem);

    &.rounded {
      border-radius: var(--border-radius-lg);
    }
  }
</style>
