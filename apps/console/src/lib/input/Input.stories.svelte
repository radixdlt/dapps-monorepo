<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Input from './Input.svelte'
  import Label from '../Label.svelte'
  import Checkbox from '@svelte-ui/components/_base/checkbox/Checkbox.svelte'

  let value = ''
</script>

<Meta title="Dev console / Form / Input" />

<Story name="Primary">
  <div class="content">
    <div class="variation">
      <Label>Name</Label>
      <Input placeholder="Enter name" bind:value />
    </div>
    <div class="variation">
      <Label disabled>Name</Label>
      <Input placeholder="Enter name" disabled />
    </div>

    <div class="variation">
      <Label>Name</Label>
      <Input placeholder="Enter name" error />
    </div>

    <div class="variation">
      <Label>With checkbox</Label>
      <Input placeholder="Enter name" bind:value
        ><div style:margin-right="1rem">
          <Checkbox checked>Fixed</Checkbox>
        </div></Input
      >
    </div>
  </div>
</Story>

<style>
  .content {
    padding: 2rem;
    background-color: #f4f5f9;
  }
  .variation {
    margin-bottom: 2rem;
  }
</style>
