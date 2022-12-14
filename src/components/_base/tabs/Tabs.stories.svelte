<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Tab from './Tab.svelte'
  import TabPanel from './TabPanel.svelte'
  import Tabs from './Tabs.svelte'
</script>

<Meta title="Tabs" component={Tabs} />

<Template>
  <Tabs>
    <svelte:fragment slot="tabs">
      <Tab>One of my accounts</Tab>
      <Tab>content1</Tab>
    </svelte:fragment>
    <svelte:fragment slot="panels">
      <TabPanel>One of my accounts</TabPanel>
      <TabPanel>content1</TabPanel>
    </svelte:fragment>
  </Tabs>
</Template>

<Story name="Primary" />
