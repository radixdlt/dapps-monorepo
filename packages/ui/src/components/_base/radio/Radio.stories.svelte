<script context="module">
  export const meta = {}
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
  import Radio from './Radio.svelte'
</script>

<Story name="Selected">
  <Radio selected />
</Story>

<Story name="Not Selected">
  <Radio />
</Story>
