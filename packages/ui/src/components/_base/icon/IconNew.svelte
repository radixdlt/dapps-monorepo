<script lang="ts">
  import { icons } from '../../../icon-assets'

  export let type: keyof typeof icons
  export let size: 'small' | 'medium' | 'large' = 'medium'
  export let faded = false
</script>

<img class={size} class:faded on:click src={icons[type]} alt="icon {type}" />

<style>
  img {
    display: block;
  }

  .faded {
    filter: grayscale(100%);
    opacity: 50%;
  }

  .small {
    width: var(--size, 0.75rem);
    height: var(--size, 0.75rem);
  }
  .medium {
    width: var(--size, 1rem);
    height: var(--size, 1rem);
  }

  .large {
    width: var(--size, 3rem);
    height: var(--size, 3rem);
  }
</style>
