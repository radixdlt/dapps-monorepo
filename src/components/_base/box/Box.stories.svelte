<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Box from './Box.svelte'
</script>

<Meta title="Box" component={Box} />

<Template>
  <Box background="primaryButton">Hello</Box>
  <Box py="medium" my="medium" background="primaryButton">Hello</Box>
</Template>

<Story name="Primary" />
