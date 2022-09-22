<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Card from './Card.svelte'
</script>

<Meta title="Card" component={Card} />

<Template>
  <Card>
    <div slot="header">Header</div>
    <div slot="body">Body</div>
  </Card>
</Template>

<Story name="Primary" />
