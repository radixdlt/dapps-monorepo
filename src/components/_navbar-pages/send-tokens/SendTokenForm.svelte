<script lang="ts" context="module">
  export const boxStyle = {
    width: '70%',
    display: 'grid',
    gridTemplateColumns: '80px auto',
    alignItems: 'baseline',
    gap: '$2xl'
  }
</script>

<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Select, { type Option } from '@components/_base/select/Select.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import SendFungible from './SendFungible.svelte'
  import SendNonFungible from './SendNonFungible.svelte'
  import { goto } from '$app/navigation'
  import RadioTab from '@components/_base/tabs/types/RadioTab.svelte'
  import { getResources } from './side-effects'
  import { writable } from 'svelte/store'
  import { query } from '@api/query'

  type OptionsType = Option<{ address: string }>

  export let accounts: OptionsType[] | undefined = undefined
  export let tokenType: 'fungible' | 'nonFungible'

  const { send, loading, response } = query('sendTransaction')

  $: selectedFromAccount = accounts?.[0] || { address: '', label: '' }

  const transformedOverview =
    writable<Awaited<ReturnType<typeof getResources>>>(undefined)

  $: getResources(selectedFromAccount.address).then(transformedOverview.set)

  let selectedToAccount = { address: '', label: '' }

  let otherAccount = ''

  let resourceSelected = false

  let transactionManifest: string

  let setTransactionManifest = (manifest: string) =>
    (transactionManifest = manifest)

  const setResourceSelected = (selected: boolean) =>
    (resourceSelected = selected)

  $: if ($response)
    goto(`/send-nft/success?txID=${$response.transactionIntentHash}`)
</script>

<Box bgColor="surface" flex="col" gap="medium">
  <Box bgColor="surface" mt="medium" cx={boxStyle}>
    <Text bold align="right">From</Text>
    <Box bgColor="surface" px="none" cx={{ width: '300px' }}>
      <Select bind:selected={selectedFromAccount} options={accounts} />
    </Box>
  </Box>
  <Box bgColor="surface" mt="medium" cx={boxStyle}>
    <Text bold align="right">To</Text>
    <Tabs>
      <svelte:fragment slot="tabs">
        <RadioTab />
        <Box
          bgColor="surface"
          inline
          p="none"
          cx={{ marginRight: '$lg', marginLeft: '$sm' }}>One of My Accounts</Box
        >
        <RadioTab />
        <Box
          bgColor="surface"
          inline
          p="none"
          cx={{ marginRight: '$lg', marginLeft: '$sm' }}>Other account</Box
        >
      </svelte:fragment>
      <svelte:fragment slot="panels">
        <TabPanel>
          <Box bgColor="surface" px="none" cx={{ width: '300px' }}>
            <Select
              placeholder="Select personal account"
              bind:selected={selectedToAccount}
              options={accounts}
            />
          </Box>
        </TabPanel>
        <TabPanel
          ><Input
            type="text"
            bind:value={otherAccount}
            placeholder="Account Address"
          /></TabPanel
        >
      </svelte:fragment>
    </Tabs>
  </Box>
  {#if tokenType === 'fungible'}
    <SendFungible
      selectedFromAccount={selectedFromAccount.address}
      selectedToAccount={selectedToAccount.address || otherAccount}
      resources={$transformedOverview?.fungible || []}
      {setTransactionManifest}
      {setResourceSelected}
    />
  {/if}
  {#if tokenType === 'nonFungible'}
    <SendNonFungible
      selectedFromAccount={selectedFromAccount.address}
      selectedToAccount={selectedToAccount.address || otherAccount}
      resources={$transformedOverview?.nonFungible}
      {setTransactionManifest}
      {setResourceSelected}
    />
  {/if}
  <Box bgColor="surface" justify="end">
    <Button
      disabled={!(
        selectedFromAccount.address &&
        (selectedToAccount?.address || otherAccount.length > 0) &&
        resourceSelected
      )}
      on:click={() => send(transactionManifest)}
    >
      {#if $loading}
        <LoadingSpinner />
      {:else}
        Send
      {/if}
    </Button>
  </Box>
</Box>
