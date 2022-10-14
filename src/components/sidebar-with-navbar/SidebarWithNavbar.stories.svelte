<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import SidebarWithNavbar from './SidebarWithNavbar.svelte'
  const anyobject: any = {}
</script>

<Meta title="SidebarWithNavbar" component={SidebarWithNavbar} />

<Template>
  <SidebarWithNavbar page={anyobject} />
</Template>

<Story name="Primary" />
