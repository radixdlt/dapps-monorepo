<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import { getTxManifest } from '../../../to-be-removed/ret'
  import Text from '@components/_base/text/Text.svelte'
  import Status from './values/Status.svelte'
  import Date from './values/Date.svelte'
  import Fee from './values/Fee.svelte'
  import CreatedEntities from './values/CreatedEntities.svelte'
  import ReferencedEntities from './values/ReferencedEntities.svelte'
  import StateVersion from './values/StateVersion.svelte'
  import Message from './values/Message.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import BoxTab from '@components/_base/tabs/types/BoxTab.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Overview from './Overview.svelte'
  import Raw from './Raw.svelte'
  import Epoch from './values/Epoch.svelte'
  import Round from './values/Round.svelte'
  import { goto } from '$app/navigation'
  import { query } from '@api/query'
  import { infoboxEntry } from '@components/info-box/InfoBox.svelte'

  export let transactionHash: string

  let manifest: string | undefined

  $: ({
    send,
    response: txDetails,
    loading,
    error
  } = query('getTransactionDetails'))
  $: send(transactionHash)

  $: ({ send: _send, response: networkState } = query('getTransactionDetails'))
  $: _send(transactionHash, $networkState?.stateVersion!)

  $: if ($txDetails)
    getTxManifest($txDetails.details).then((res) => {
      manifest = res
    })

  $: if ($error) goto('/not-found')

  $: entries = [
    infoboxEntry(Status, 'Status', $txDetails?.status),
    infoboxEntry(StateVersion, 'State version', $txDetails?.stateVersion!),
    infoboxEntry(Epoch, 'Epoch', $networkState?.ledgerState.epoch),
    infoboxEntry(Round, 'Round', $networkState?.ledgerState.round),
    infoboxEntry(Date, 'Date', $txDetails?.date!),
    infoboxEntry(Fee, 'Fee', `${$txDetails?.fee} XRD`),
    infoboxEntry(Message, 'Message', $txDetails?.message),
    infoboxEntry(
      CreatedEntities,
      'Created entities',
      $txDetails?.createdEntities ?? []
    ),
    infoboxEntry(
      ReferencedEntities,
      'Referenced entities',
      $txDetails?.referencedEntities ?? []
    )
  ] as const
</script>

<Box>
  <ResourceViewTitle title="Transaction" resourceAddress={transactionHash} />
</Box>

<Box bgColor="surface" useTabs>
  <Tabs box>
    <svelte:fragment slot="tabs">
      <BoxTab><Text bold>Overview</Text></BoxTab>
      <BoxTab><Text bold>Raw receipt</Text></BoxTab>
    </svelte:fragment>
    <svelte:fragment slot="panels">
      <TabPanel>
        <Overview {entries} {manifest} loading={$loading} />
      </TabPanel>
      <TabPanel>
        <Raw receipt={$txDetails?.receipt} />
      </TabPanel>
    </svelte:fragment>
  </Tabs>
</Box>
