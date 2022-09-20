<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Card from './Card.svelte'
</script>

<Meta
  title="Card"
  component={Card}
/>

<Template let:args>
  <Card>{args.text}</Card>
</Template>

<Story
  name="Primary"
  args={{
    text: 'Test'
  }}
/>