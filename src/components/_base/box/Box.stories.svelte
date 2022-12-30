<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Box from './Box.svelte'
</script>

<Meta title="Box" component={Box} />

<Template>
  <Box bgColor="surface" cx={{ width: '$3xl' }}>Hello</Box>
  <Box bgColor="surface" py="medium" my="medium">Hello</Box>
</Template>

<Story name="Primary" />
