<script lang="ts">
  import { icons } from '../../../icon-assets'

  export let type: keyof typeof icons
  export let size: 'small' | 'large' = 'small'
</script>

<img class={size} on:click src={icons[type]} />

<style>
  .small {
    width: 1rem;
    height: 1rem;
  }

  .large {
    width: 3rem;
    height: 3rem;
  }
</style>
