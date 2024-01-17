<script lang="ts">
  import IconNew from '@svelte-ui/components/_base/icon/IconNew.svelte'
  import IosShare from './ios-share.svg'

  export let rotate = false
  export let disable = false
</script>

<button class:rotate class:disable on:click>
  <IconNew icon={IosShare} --size="18px" />
</button>

<style lang="scss">
  .rotate {
    transform: rotate(90deg);
  }

  .disable {
    pointer-events: none;
    opacity: 0.35;
    filter: grayscale(100%);
  }
</style>
