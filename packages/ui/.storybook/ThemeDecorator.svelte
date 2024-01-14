<script>
  import Theme from '@components/_base/theme/Theme.svelte'
</script>

<Theme theme="light">
  <slot />
</Theme>

<style lang="scss" global>
  .common {
    height: unset !important;
  }
</style>
