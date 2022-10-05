<script lang="ts">
  import SidebarItem from '@components/sidebar-item/SidebarItem.svelte'
  import Sidebar from '@components/_base/sidebar/Sidebar.svelte'
</script>

<Sidebar disableClickOutside show>
  <SidebarItem link="/explorer" icon="dashboard">Dashboard</SidebarItem>
  <SidebarItem link="/staking" icon="validators">Staking/Validators</SidebarItem
  >
</Sidebar>
