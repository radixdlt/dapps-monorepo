<script lang="ts" context="module">
  export const boxStyle = {
    width: '70%',
    display: 'grid',
    gridTemplateColumns: '80px auto',
    alignItems: 'baseline',
    gap: '$2xl'
  }

  export const Context = {
    SET_RESOURCE_SELECTED: 'setResourceSelected',
    ON_SEND: 'onSend'
  } as const

  export type Context = {
    [Context.SET_RESOURCE_SELECTED]: (bool: boolean) => void
    [Context.ON_SEND]: (sendFn: () => Promise<void>) => void
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
  import { setContext } from 'svelte'
  import { stateMachine } from '@stateMachines/account-state-machine'
  import { useMachine } from '@xstate/svelte'

  const { state, send } = useMachine(stateMachine)

  type OptionsType = Options<{ address: string }>

  export let accounts: OptionsType[] | undefined = undefined

  $: selectedFromAccount = accounts?.[0] || { address: '', label: '' }

  $: send('LOAD', {
    address: selectedFromAccount.address
  })

  let selectedToAccount = { address: '', label: '' }

  let otherAccount = ''

  let pending = false

  let resourceSelected = false

  const sendTokens = () => {
    pending = true
    sendFn()
      .then((_) => (pending = false))
      .catch((_) => (pending = false))
  }

  let sendFn: () => Promise<unknown>

  setContext<Context['setResourceSelected']>(
    Context.SET_RESOURCE_SELECTED,
    (bool: boolean) => (resourceSelected = bool)
  )
  setContext<Context['onSend']>(
    Context.ON_SEND,
    (_sendFn: () => Promise<void>) => (sendFn = _sendFn)
  )
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
  <slot
    selectedFromAccount={selectedFromAccount.address}
    selectedToAccount={selectedToAccount.address}
    fungibleResources={$state.context.transformedOverview?.fungible}
    nonFungibleResources={$state.context.transformedOverview?.nonFungible}
  />
  <Box bgColor="surface" justify="end">
    <Button
      disabled={!(
        selectedFromAccount.address &&
        (selectedToAccount?.address || otherAccount.length > 0) &&
        resourceSelected
      )}
      on:click={() => sendTokens()}
    >
      {#if pending}
        <LoadingSpinner />
      {:else}
        Send
      {/if}
    </Button>
  </Box>
</Box>
