<script lang="ts" context="module">
  export const meta = {}
</script>

<script>
  import { Story } from '@storybook/addon-svelte-csf'
  import CopyableText from './CopyableText.svelte'
</script>

<Story name="Primary">
  <CopyableText value="sample text" />
</Story>

<Story name="Short">
  <CopyableText
    value="sample long long long long long long long long text"
    shorten={{
      fn: (text) => text.slice(0, 10),
      behavior: 'always'
    }}
  />
</Story>

<Story name="Responsive">
  <CopyableText
    value="sample long long long long long long long long text"
    shorten={{
      fn: (text) => text.slice(0, 10),
      behavior: 'responsive'
    }}
  />
</Story>
