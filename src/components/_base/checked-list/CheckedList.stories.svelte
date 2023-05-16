<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import CheckedList from './CheckedList.svelte'

  const options = [
    {
      name: 'Bob',
      label: 'Bob',
      checked: false
    },
    {
      name: 'Kirby',
      label: 'Kirby',
      checked: false
    }
  ]
</script>

<Meta title="CheckedList" component={CheckedList} />
<Template>
  <CheckedList {options} />
</Template>

<Story name="Primary" />
