<script context="module">
  export const meta = {}
</script>

<script>
  import { Story } from '@storybook/addon-svelte-csf'

  import NftImage from './NftImage.svelte'
</script>

<Story name="Small">
  <div style:background-color="var(--theme-surface-3)" style:padding="20px">
    <NftImage url="https://picsum.photos/1000/500?shuffle" />
  </div>
</Story>

<Story name="Large">
  <div style:background-color="var(--theme-surface-3)" style:padding="20px">
    <NftImage size="large" url="https://picsum.photos/1000/500?shuffle" />
  </div>
</Story>
