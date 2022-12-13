<script lang="ts">
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels
  } from '@rgossiaux/svelte-headlessui'
  import { css } from '@styles'

  export let tabs: Array<{ name: string; content: any }> = []

  const tabClass = css({
    width: '140px',
    height: '60px',
    cursor: 'pointer',
    color: 'inherit',
    backgroundColor: '$transparent',
    border: '1px solid $borderColor',
    shadow: true,
    mr: '$md',
    '&:hover': {
      backgroundColor: '$primaryGhostButtonHoverText',
      color: '$primaryGhostButtonText'
    },
    '&:focus': {
      backgroundColor: '$primaryGhostButtonText',
      color: 'white'
    }
  })

  const tabPanelClass = css({
    px: '$sm',
    py: '$md'
  })
</script>

<TabGroup>
  <TabList>
    {#each tabs as tab}
      <Tab class={tabClass()}>{tab.name}</Tab>
    {/each}
  </TabList>
  <TabPanels>
    {#each tabs as tab}
      <TabPanel class={tabPanelClass()}>
        <p>Tab {tab.content}</p>
      </TabPanel>
    {/each}
  </TabPanels>
</TabGroup>
