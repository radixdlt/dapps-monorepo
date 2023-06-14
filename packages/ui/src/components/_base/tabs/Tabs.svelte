<script lang="ts">
  import { TabGroup, TabList, TabPanels } from '@rgossiaux/svelte-headlessui'
  import { css } from '@styles'
  import { TAB_HEIGHT } from './types/BoxTab.svelte'

  export let box = false

  const boxTab = css({
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: `0`,
    height: TAB_HEIGHT,
    padding: '10px'
  })()
</script>

<TabGroup>
  <TabList class={box ? boxTab : ''}>
    <slot name="tabs" />
  </TabList>
  <TabPanels>
    <slot name="panels" />
  </TabPanels>
</TabGroup>
