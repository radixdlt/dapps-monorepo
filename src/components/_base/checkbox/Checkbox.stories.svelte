<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Checkbox from './Checkbox.svelte'

  const options = [
    {
      name: 'Bob',
      label: 'Bob'
    },
    {
      name: 'Kirby',
      label: 'Kirby'
    }
  ]
</script>

<Meta title="Checkbox" component={Checkbox} />
<Template>
  <Checkbox {options} />
</Template>

<Story name="Primary" />
