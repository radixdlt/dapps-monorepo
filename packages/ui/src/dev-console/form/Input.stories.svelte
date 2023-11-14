<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Input from './Input.svelte'
  import Label from './Label.svelte'

  let value = ''

  $: {
    console.log(value)
  }
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
