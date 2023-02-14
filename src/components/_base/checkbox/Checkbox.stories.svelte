<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Checkbox from './Checkbox.svelte'

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

<Meta title="Checkbox" component={Checkbox} />
<Template>
  <Checkbox {options} />
</Template>

<Story name="Primary" />
