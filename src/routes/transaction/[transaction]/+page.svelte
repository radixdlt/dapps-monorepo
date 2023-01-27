<script lang="ts">
  import { query } from '@queries'
  import Box from '@components/_base/box/Box.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import { getTxManifest } from '../../../to-be-removed/ret'
  import Text from '@components/_base/text/Text.svelte'
  import type { PageData } from './$types'
  import Status from './values/Status.svelte'
  import Date from './values/Date.svelte'
  import Fee from './values/Fee.svelte'
  import type { SvelteComponent } from 'svelte'
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

  export let data: PageData

  $: transactionAddress = data.transactionAddress

  let manifest: string | undefined

  $: ({ state } = query('getTransactionDetails', { txID: transactionAddress }))
  $: ({ state: networkState } = query('getTransactionDetails', {
    txID: transactionAddress,
    stateVersion: $state.data?.stateVersion
  }))

  $: if ($state.status === 'success') {
    getTxManifest($state.data.details).then((res) => {
      manifest = res
    })
  }

  $: console.log($state.error)

  $: if ($state.status === 'error') {
    // goto('/not-found')
  }

  const entry = <
    C extends typeof SvelteComponent,
    V extends InstanceType<C>['$$prop_def']['value']
  >(
    component: C,
    key: string,
    value: V
  ) => ({
    key,
    value,
    component
  })

  $: entries = [
    entry(Status, 'Status', $state.data?.status),
    entry(StateVersion, 'State version', $state.data?.stateVersion),
    entry(Epoch, 'Epoch', $networkState.data?.ledgerState.epoch),
    entry(Round, 'Round', $networkState.data?.ledgerState.round),
    entry(Date, 'Date', $state.data?.date),
    entry(Fee, 'Fee', `${$state.data?.fee} XRD`),
    entry(Message, 'Message', $state.data?.message),
    entry(
      CreatedEntities,
      'Created entities',
      $state.data?.createdEntities ?? []
    ),
    entry(
      ReferencedEntities,
      'Referenced entities',
      $state.data?.referencedEntities ?? []
    )
  ] as const
</script>

<Box>
  <ResourceViewTitle title="Transaction" resourceAddress={transactionAddress} />
</Box>

<Box bgColor="surface" useTabs>
  <Tabs box>
    <svelte:fragment slot="tabs">
      <BoxTab><Text bold>Overview</Text></BoxTab>
      <BoxTab><Text bold>Raw receipt</Text></BoxTab>
    </svelte:fragment>
    <svelte:fragment slot="panels">
      <TabPanel>
        <Overview {entries} {manifest} loading={$state.status === 'loading'} />
      </TabPanel>
      <TabPanel>
        <Raw receipt={$state.data?.receipt} />
      </TabPanel>
    </svelte:fragment>
  </Tabs>
</Box>
