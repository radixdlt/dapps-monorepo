<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Box from '../box/Box.svelte'
  import Select from './Select.svelte'

  const people = [
    { id: '1', label: 'Durward Reynolds', unavailable: false },
    { id: '2', label: 'Kenton Towne', unavailable: false },
    { id: '3', label: 'Therese Wunsch', unavailable: false },
    { id: '4', label: 'Benedict Kessler', unavailable: true },
    { id: '5', label: 'Katelyn Rohan', unavailable: false }
  ]

  let selected = people[0]

  // @ts-ignore ts not working well in storybook yet
  const handleSelect = (nextSelected) => {
    selected = nextSelected
  }
</script>

<Meta title="Select" component={Select} />

<Story name="Primary">
  <Box transparent cx={{ width: '250px' }}>
    <Select options={people} {selected} {handleSelect} />
  </Box>
</Story>
