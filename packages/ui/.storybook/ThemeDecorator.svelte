<script>
  import Theme from '@components/_base/theme/Theme.svelte'
</script>

<Theme theme="light">
  <slot />
</Theme>

<style lang="scss" global>
  @use '../src/global.css';
</style>
