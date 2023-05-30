<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import FilterCard from './FilterCard.svelte'

  let values = Array(100)
    .fill(0)
    .map(() => Math.random() * 100)
</script>

<Meta title="Navbar Pages / Validators / Filter Card" />

<Story name="Primary">
  <FilterCard minText="MIN FEE (%)" maxText="MAX FEE (%)" {values} />
</Story>
