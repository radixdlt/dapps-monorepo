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
  import { writable } from 'svelte/store'

  type OptionsType = Options<{ address: string }>

  export let pending: boolean = false
  export let onSend: ({
    resource,
    fromAccount,
    toAccount,
    amount
  }: {
    resource: string
    fromAccount: string
    toAccount: string
    amount: number
  }) => void = () => {}
  export let accounts: OptionsType[] | undefined = undefined

  $: selectedFromAccount = accounts?.[0] || { address: '', label: '' }

  let selectedToAccount = { address: '', label: '' }

  let otherAccount = ''

  let amountToSend = writable(0)
  let selectedResourceAddress = writable<string>()
  let hasEnoughTokens = writable(false)

  const boxStyle = {
    width: '70%',
    display: 'grid',
    gridTemplateColumns: '80px auto',
    alignItems: 'baseline',
    gap: '$2xl'
  }
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
  <Box bgColor="surface" cx={{ ...boxStyle }}>
    <slot {selectedResourceAddress} {hasEnoughTokens} {amountToSend} />
  </Box>
  <Box bgColor="surface" justify="end">
    <Button
      disabled={!(
        selectedFromAccount.address &&
        (selectedToAccount?.address || otherAccount.length > 0) &&
        $amountToSend > 0 &&
        $selectedResourceAddress &&
        $hasEnoughTokens
      )}
      on:click={() =>
        onSend({
          resource: $selectedResourceAddress,
          fromAccount: selectedFromAccount.address,
          toAccount: otherAccount || selectedToAccount.address,
          amount: $amountToSend
        })}
    >
      {#if pending}
        <LoadingSpinner />
      {:else}
        Send
      {/if}
    </Button>
  </Box>
</Box>
