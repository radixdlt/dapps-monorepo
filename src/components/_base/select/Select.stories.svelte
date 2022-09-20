<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Select from './Select.svelte'
</script>

<Meta title="Select" component={Select} />

<Story name="Primary">
  <Select size="medium">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </Select>
</Story>
