<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { accounts } from '@stores'
  import { shortenAddress } from '@utils'
  import Select, { type Options } from '@components/_base/select/Select.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Tab from '@components/_base/tabs/Tab.svelte'
  import Button from '@components/_base/button/Button.svelte'

  $: accountList = $accounts?.map<Options>((account) => ({
    id: account.address,
    label: `${account.label} - (${shortenAddress(account.address)})`,
    unavailable: false
  }))

  export let balance: any = undefined

  $: balanceList =
    balance &&
    Object.keys(balance).map((key) => ({
      id: key,
      label: key
    }))

  let selectedBalance: Options = { id: '', label: '' }

  export let onSelectFromAccount: (account: string) => void = () => {}

  let amountToSend = ''

  let selectedFromAccount = { id: '', label: '' }

  const handleSelectFromAccount = (nextSelected: Options) => {
    selectedFromAccount = nextSelected
    onSelectFromAccount(nextSelected.id)
  }

  let selectedToAccount = { id: '', label: '' }

  const handleSelectToAccount = (nextSelected: Options) => {
    selectedToAccount = nextSelected
  }

  const handleSelectBalance = (nextSelected: Options) => {
    selectedBalance = nextSelected
  }

  let otherAccount = ''

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

  $: getAmount = () => {
    if (selectedBalance.id !== '') {
      return balance[selectedBalance?.id] || Object.values(balance)?.[0]
    } else {
      return 'No data'
    }
  }

  const boxStyle = {
    width: '70%',
    display: 'grid',
    gridTemplateColumns: '80px auto',
    alignItems: 'baseline',
    gap: '$2xl'
  }
</script>

<Card>
  <Text slot="header">From/To</Text>
  <Box flex="col" gap="medium" slot="body">
    <Box mt="medium" cx={boxStyle}>
      <Text align="right">From</Text>
      <Select
        placeholder="Select personal account"
        handleSelect={handleSelectFromAccount}
        options={accountList}
      />
    </Box>
    <Divider color="border" />
    <Box mt="medium" cx={boxStyle}>
      <Text align="right">To</Text>
      <Tabs>
        <svelte:fragment slot="tabs">
          <Tab>One of my accounts</Tab>
          <Tab>Other account</Tab>
        </svelte:fragment>
        <svelte:fragment slot="panels">
          <TabPanel>
            <Select
              placeholder="Select personal account"
              handleSelect={handleSelectToAccount}
              options={accountList}
            /></TabPanel
          >
          <TabPanel
            ><Input
              bind:value={otherAccount}
              placeholder="Account address"
            /></TabPanel
          >
        </svelte:fragment>
      </Tabs>
    </Box>
    <Divider color="border" />
    <Box mt="medium" cx={boxStyle}>
      <Text align="right">Amount</Text>
      <Box flex="row" items="baseline">
        <Box p="none" cx={{ minWidth: '140px' }}>
          <Select
            placeholder="Select resource"
            handleSelect={handleSelectBalance}
            options={balanceList}
          />
        </Box>
        <Box>
          <Input bind:value={amountToSend} placeholder="Amount" />
          <Text inline size="small" color="secondary">{getAmount()}</Text>
          <Text inline size="xsmall" muted>(Available balance)</Text>
        </Box>
      </Box>
    </Box>
    <Box justify="end">
      <Button
        disabled={!selectedFromAccount?.id ||
          !selectedToAccount?.id ||
          !amountToSend ||
          !selectedBalance?.id}
        on:click={() =>
          onSend({
            resource: selectedBalance.id,
            fromAccount: selectedFromAccount.id,
            toAccount: selectedToAccount.id || otherAccount,
            amount: Number(amountToSend)
          })}>Send</Button
      >
    </Box>
  </Box>
</Card>
