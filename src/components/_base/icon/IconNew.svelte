<script lang="ts">
  import { icons } from '../../../icon-assets'

  export let type: keyof typeof icons
  export let size: 'small' | 'medium' | 'large' = 'medium'
</script>

<img class={size} on:click src={icons[type]} />

<style>
  img {
    display: block;
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
