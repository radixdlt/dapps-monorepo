<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import ButtonTab from './types/ButtonTab.svelte'
  import TabPanel from './TabPanel.svelte'
  import Tabs from './Tabs.svelte'
  import RadioTab from './types/RadioTab.svelte'
  import BoxTab from './types/BoxTab.svelte'
  import Box from '../box/Box.svelte'
</script>

<Meta title="Tabs" component={Tabs} />

<Story name="Button">
  <Tabs>
    <svelte:fragment slot="tabs">
      <ButtonTab>tab1</ButtonTab>
      <ButtonTab>tab2</ButtonTab>
    </svelte:fragment>
    <svelte:fragment slot="panels">
      <TabPanel>content1</TabPanel>
      <TabPanel>content2</TabPanel>
    </svelte:fragment>
  </Tabs>
</Story>

<Story name="Radio">
  <Tabs>
    <svelte:fragment slot="tabs">
      <RadioTab>tab1</RadioTab>
      <RadioTab>tab2</RadioTab>
    </svelte:fragment>
    <svelte:fragment slot="panels">
      <TabPanel>content1</TabPanel>
      <TabPanel>content2</TabPanel>
    </svelte:fragment>
  </Tabs>
</Story>

<Story name="Box">
  <Box useTabs bgColor="surface">
    <Tabs box>
      <svelte:fragment slot="tabs">
        <BoxTab>tab1</BoxTab>
        <BoxTab>tab2</BoxTab>
      </svelte:fragment>
      <svelte:fragment slot="panels">
        <TabPanel>content1</TabPanel>
        <TabPanel>content2</TabPanel>
      </svelte:fragment>
    </Tabs>
  </Box>
</Story>
