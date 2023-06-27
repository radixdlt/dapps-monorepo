<script lang="ts" context="module">
  export const EMPTY_VALUE = `<no value>`
</script>

<script lang="ts">

</script>

<div class="info-box">
  <slot />
</div>

<style lang="scss">
  @use '../../mixins';

  .info-box {
    padding: 1.5rem;

    @include mixins.desktop {
      padding: 2.5rem;
    }
  }
</style>

