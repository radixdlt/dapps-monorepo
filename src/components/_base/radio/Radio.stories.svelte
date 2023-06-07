<script lang="ts">
    import { Meta, Story } from '@storybook/addon-svelte-csf'
    import Radio from './Radio.svelte'
</script>

<Meta title="Radio" />

<Story name="Selected">
  <Radio selected />
</Story>

<Story name="Not Selected">
  <Radio />
</Story>
