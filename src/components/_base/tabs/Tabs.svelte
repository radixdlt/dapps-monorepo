<script lang="ts">
  import { TabGroup, TabList, TabPanels } from '@rgossiaux/svelte-headlessui'
</script>

<TabGroup>
  <TabList>
    <slot name="tabs" />
  </TabList>
  <TabPanels>
    <slot name="panels" />
  </TabPanels>
</TabGroup>
