<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Text from './Text.svelte'
</script>

<Meta title="Text" component={Text} />

<Template>
  <Text size="xsmall">xsmall Hello</Text>
  <Text>Medium Hello</Text>
  <Text size="large">large Hello</Text>
  <Text size="large" muted>large Hello muted</Text>
  <Text size="large" color="secondary">large Hello secondary color</Text>
  <Text size="large" color="tertiary">large Hello tertiary color</Text>
</Template>

<Story name="Primary" />
