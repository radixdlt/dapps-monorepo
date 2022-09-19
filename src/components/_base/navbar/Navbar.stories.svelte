<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Navbar from './Navbar.svelte'
</script>

<Meta title="Navbar" />

<Story name="Primary">
  <Navbar initialSelectedId="first">
    <p id="first">First</p>
    <p>Second</p>
    <p>Third</p>
  </Navbar>
</Story>
