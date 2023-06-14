<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import BoxTab from '@components/_base/tabs/types/BoxTab.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Overview from './Overview.svelte'
  import Raw from './Raw.svelte'
  import type { getTransactionDetails } from '@api/gateway'

  export let tx: ReturnType<typeof getTransactionDetails>
  export let manifest: Promise<string | undefined>
</script>

<Box bgColor="surface" useTabs>
  <Tabs box>
    <svelte:fragment slot="tabs">
      <BoxTab><Text bold>Overview</Text></BoxTab>
      <BoxTab><Text bold>Raw receipt</Text></BoxTab>
    </svelte:fragment>
    <svelte:fragment slot="panels">
      <TabPanel>
        <Overview {tx} {manifest} />
      </TabPanel>
      <TabPanel>
        <Raw receipt={tx.then((tx) => tx.receipt)} />
      </TabPanel>
    </svelte:fragment>
  </Tabs>
</Box>
