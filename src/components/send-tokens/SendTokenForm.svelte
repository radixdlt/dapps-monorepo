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
  import Select, { type Options } from '@components/_base/select/Select.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Tab from '@components/_base/tabs/Tab.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import { stateMachine } from '@stateMachines/account-state-machine'
  import { useMachine } from '@xstate/svelte'
  import SendFungible from './SendFungible.svelte'
  import SendNonFungible from './SendNonFungible.svelte'
  import { mutate } from '@queries'
  import { goto } from '$app/navigation'

  const { state, send } = useMachine(stateMachine)

  type OptionsType = Options<{ address: string }>

  export let accounts: OptionsType[] | undefined = undefined
  export let tokenType: 'fungible' | 'nonFungible'

  const { trigger, data, loading } = mutate('sendTransaction')

  $: selectedFromAccount = accounts?.[0] || { address: '', label: '' }

  $: send('LOAD', {
    address: selectedFromAccount.address
  })

  let selectedToAccount = { address: '', label: '' }

  let otherAccount = ''

  let resourceSelected = false

  let transactionManifest: string

  let setTransactionManifest = (manifest: string) =>
    (transactionManifest = manifest)
  const setResourceSelected = (selected: boolean) =>
    (resourceSelected = selected)

  $: if ($data) goto(`/send-nft/success?txID=${$data.transactionIntentHash}`)
</script>

<Box bgColor="surface" flex="col" gap="medium">
  <Box bgColor="surface" mt="medium" cx={boxStyle}>
    <Text bold align="right">From</Text>
    <Box bgColor="surface" px="none" cx={{ width: '300px' }}>
      <Select
        handleSelect={(account) => (selectedFromAccount = account)}
        options={accounts}
      />
    </Box>
  </Box>
  <Box bgColor="surface" mt="medium" cx={boxStyle}>
    <Text bold align="right">To</Text>
    <Tabs>
      <svelte:fragment slot="tabs">
        <Tab _default />
        <Box
          bgColor="surface"
          inline
          p="none"
          cx={{ marginRight: '$lg', marginLeft: '$sm' }}>One of My Accounts</Box
        >
        <Tab />
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
              handleSelect={(account) => (selectedToAccount = account)}
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
      selectedToAccount={selectedToAccount.address}
      resources={$state.context.transformedOverview?.fungible || []}
      {setTransactionManifest}
      {setResourceSelected}
    />
  {/if}
  {#if tokenType === 'nonFungible'}
    <SendNonFungible
      selectedFromAccount={selectedFromAccount.address}
      selectedToAccount={selectedToAccount.address}
      resources={$state.context.transformedOverview?.nonFungible}
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
      on:click={() => trigger({ transactionManifest })}
    >
      {#if $loading}
        <LoadingSpinner />
      {:else}
        Send
      {/if}
    </Button>
  </Box>
</Box>
