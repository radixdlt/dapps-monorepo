<script context="module">
  export const meta = {}
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
  import Header from './Header.svelte'
  import { RadixDappToolkit } from '@common/rdt'
  RadixDappToolkit({ dAppDefinitionAddress: '', networkId: 12 })
</script>

<Story name="Primary">
  <Header />
</Story>

<style lang="scss">
  :global(body) {
    // storybook adds a padding to the body
    padding: 0 !important;
  }
</style>
