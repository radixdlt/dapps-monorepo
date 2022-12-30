<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Box from '../box/Box.svelte'
  import Select from './Select.svelte'

  const people = [
    { id: 1, label: 'Durward Reynolds', unavailable: false },
    { id: 2, label: 'Kenton Towne', unavailable: false },
    { id: 3, label: 'Therese Wunsch', unavailable: false },
    { id: 4, label: 'Benedict Kessler', unavailable: true },
    { id: 5, label: 'Katelyn Rohan', unavailable: false }
  ]
</script>

<Meta title="Select" component={Select} />

<Story name="Primary">
  <Box cx={{ width: '250px' }}>
    <Select options={people} />
  </Box>
</Story>
