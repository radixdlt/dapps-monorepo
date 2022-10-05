<script lang="ts">
  import SidebarItem from '@components/sidebar-item/SidebarItem.svelte'
  import Sidebar from '@components/_base/sidebar/Sidebar.svelte'
</script>

<Sidebar disableClickOutside show>
  <SidebarItem icon="dashboard">Dashboard</SidebarItem>
  <SidebarItem icon="validators">Staking/Validators</SidebarItem>
</Sidebar>
