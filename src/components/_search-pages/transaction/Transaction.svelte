<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import { getTxManifest } from '../../../to-be-removed/ret'
  import Text from '@components/_base/text/Text.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import BoxTab from '@components/_base/tabs/types/BoxTab.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Overview from './Overview.svelte'
  import Raw from './Raw.svelte'
  import { goto } from '$app/navigation'
  import { query } from '@api/query'
  import { infoboxEntry } from '@components/info-box/InfoBox.svelte'
  import CreatedEntitiesKey from './entries/CreatedEntities/Key.svelte'
  import CreatedEntitiesValue from './entries/CreatedEntities/Value.svelte'
  import DateKey from './entries/Date/Key.svelte'
  import DateValue from './entries/Date/Value.svelte'
  import EpochKey from './entries/Epoch/Key.svelte'
  import EpochValue from './entries/Epoch/Value.svelte'
  import FeeKey from './entries/Fee/Key.svelte'
  import FeeValue from './entries/Fee/Value.svelte'
  import MessageKey from './entries/Message/Key.svelte'
  import MessageValue from './entries/Message/Value.svelte'
  import ReferencedEntitiesKey from './entries/ReferencedEntities/Key.svelte'
  import ReferencedEntitiesValue from './entries/ReferencedEntities/Value.svelte'
  import RoundKey from './entries/Round/Key.svelte'
  import RoundValue from './entries/Round/Value.svelte'
  import StateVersionKey from './entries/StateVersion/Key.svelte'
  import StateVersionValue from './entries/StateVersion/Value.svelte'
  import StatusKey from './entries/Status/Key.svelte'
  import StatusValue from './entries/Status/Value.svelte'

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

  $: if ($txDetails) _send(transactionHash, $txDetails.stateVersion!)

  $: if ($txDetails)
    getTxManifest($txDetails.details).then((res) => {
      manifest = res
    })

  $: if ($error) goto('/not-found')

  $: entries = [
    infoboxEntry(StatusKey, StatusValue, $txDetails?.status),
    infoboxEntry(StateVersionKey, StateVersionValue, $txDetails?.stateVersion!),
    infoboxEntry(EpochKey, EpochValue, $networkState?.ledgerState.epoch),
    infoboxEntry(RoundKey, RoundValue, $networkState?.ledgerState.round),
    infoboxEntry(DateKey, DateValue, $txDetails?.date!),
    infoboxEntry(FeeKey, FeeValue, `${$txDetails?.fee} XRD`),
    infoboxEntry(MessageKey, MessageValue, $txDetails?.message),
    infoboxEntry(
      CreatedEntitiesKey,
      CreatedEntitiesValue,
      $txDetails?.createdEntities ?? []
    ),
    infoboxEntry(
      ReferencedEntitiesKey,
      ReferencedEntitiesValue,
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
