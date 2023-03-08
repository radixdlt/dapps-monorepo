<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import BoxTab from '@components/_base/tabs/types/BoxTab.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Overview from './Overview.svelte'
  import Raw from './Raw.svelte'
  import { getTransactionDetails } from '@api/gateway'
  import { getTxManifest } from '../../../to-be-removed/ret'
  import { goto } from '$app/navigation'

  export let transactionHash: string

  let resolveManifest: (value?: string) => void
  let manifest = new Promise<string | undefined>(
    (resolve) => (resolveManifest = resolve)
  )

  $: tx = getTransactionDetails(transactionHash)
    .then((res) => getTransactionDetails(transactionHash, res.stateVersion!))
    .then((tx) => {
      getTxManifest(tx.details).then(resolveManifest)
      return tx
    })
    .catch((_) => {
      goto('/not-found')
      return undefined as unknown as Awaited<
        ReturnType<typeof getTransactionDetails>
      >
    })
</script>

<ResourceViewTitle title="Transaction" resourceAddress={transactionHash} />

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
