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
    width: 0.75rem;
    height: 0.75rem;
  }
  .medium {
    width: 1rem;
    height: 1rem;
  }

  .large {
    width: 3rem;
    height: 3rem;
  }
</style>
