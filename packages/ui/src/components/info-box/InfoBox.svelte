<script lang="ts" context="module">
  export const EMPTY_VALUE = `<no value>`
</script>

<script lang="ts">
  export let header = ''
</script>

<div class="info-box">
  {#if header}<h2>{header}</h2>{/if}
  <slot />
</div>

<style lang="scss">
  .info-box {
    padding: 1.5rem;

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    @include mixins.desktop {
      padding: 2.5rem;
    }
  }
</style>
