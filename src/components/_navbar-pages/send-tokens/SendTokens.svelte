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
  import { goto } from '$app/navigation'
  import RadioTab from '@components/_base/tabs/types/RadioTab.svelte'
  import { getResources } from './side-effects'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'

  type OptionsType = Option<{ address: string }>

  export let accounts: OptionsType[]

  let transformedOverview: Promise<Awaited<ReturnType<typeof getResources>>> =
    new Promise((resolve) => {})

  $: if (selectedFromAccount)
    transformedOverview = getResources(selectedFromAccount.address)

  let selectedFromAccount: { address: string; label: string } | undefined
  let selectedToAccount: { address: string; label: string } | undefined

  let otherAccount = ''

  let resourceSelected = false

  let transactionManifest: string

  let setTransactionManifest = (manifest: string) =>
    (transactionManifest = manifest)

  const setResourceSelected = (selected: boolean) =>
    (resourceSelected = selected)
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
              placeholder="Select account"
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
  <slot
    selectedFromAccount={selectedFromAccount?.address}
    selectedToAccount={selectedToAccount?.address || otherAccount}
    resources={transformedOverview}
    {setTransactionManifest}
    {setResourceSelected}
  />
  <Box bgColor="surface" justify="end">
    <SendTxButton
      disabled={!(
        selectedFromAccount?.address &&
        (selectedToAccount?.address || otherAccount.length > 0) &&
        resourceSelected
      )}
      onClick={(send) => send(transactionManifest)}
      onResponse={(response) =>
        goto(`/send-nft/success?txID=${response.transactionIntentHash}`)}
    />
  </Box>
</Box>
