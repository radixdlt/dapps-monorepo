<script context="module">
  export const meta = {}
</script>

<script lang="ts">
  import { Template, Story } from '@storybook/addon-svelte-csf'
  import Button from '../button/Button.svelte'
  import Sidebar from './Sidebar.svelte'

  let showSidebar = false
</script>

<Template>
  <Button on:click={() => (showSidebar = !showSidebar)}>Toggle Sidebar</Button>

  <Sidebar bind:showDesktopSidebar={showSidebar}>
    <button
      on:click={() => {
        showSidebar = false
      }}>hide</button
    >
  </Sidebar>
</Template>

<Story name="Primary" />
