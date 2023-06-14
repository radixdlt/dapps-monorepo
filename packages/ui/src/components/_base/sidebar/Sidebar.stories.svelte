<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Button from '../button/Button.svelte'
  import Sidebar from './Sidebar.svelte'

  let showSidebar = false
</script>

<Meta title="Sidebar" component={Sidebar} />

<Template>
  <Button on:click={() => (showSidebar = !showSidebar)}>Toggle Sidebar</Button>

  <Sidebar bind:show={showSidebar}>
    <button
      on:click={() => {
        showSidebar = false
      }}>hide</button
    >
  </Sidebar>
</Template>

<Story name="Primary" />
