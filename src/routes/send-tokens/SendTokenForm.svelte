<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { accounts } from '@stores'
  import { shortenAddress } from '@utils'
  import Select, { type Options } from '@components/_base/select/Select.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Tab from '@components/_base/tabs/Tab.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import type { TransformWithOverview } from '@stateMachines/transformers'

  type OptionsType = Options<{ address: string }>

  $: accountList = $accounts?.map<OptionsType>((account) => ({
    address: account.address,
    label: `${account.label} (${shortenAddress(account.address)})`,
    unavailable: false
  }))

  export let balance: TransformWithOverview

  $: balanceList =
    balance &&
    balance.map(({ key, address, value }) => ({
      address,
      label: key,
      value
    }))

  let selectedBalance: OptionsType = { address: '', label: '' }

  export let onSelectFromAccount: (account: string) => void = () => {}

  let amountToSend = ''

  let selectedFromAccount = { address: '', label: '' }

  const handleSelectFromAccount = (nextSelected: OptionsType) => {
    selectedFromAccount = nextSelected
    onSelectFromAccount(nextSelected.address)
  }

  let selectedToAccount = { address: '', label: '' }

  const handleSelectToAccount = (nextSelected: OptionsType) => {
    selectedToAccount = nextSelected
  }

  const handleSelectBalance = (nextSelected: OptionsType) => {
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
    if (selectedBalance.address !== '') {
      return (
        balance?.find((b) => b.address === selectedBalance.address)?.value ||
        balance?.[0].value
      )
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

<Box flex="col" gap="medium">
  <Box mt="medium" cx={boxStyle}>
    <Text bold align="right">From</Text>
    <Box px="none" cx={{ width: '300px' }}>
      <Select handleSelect={handleSelectFromAccount} options={accountList} />
    </Box>
  </Box>
  <Box mt="medium" cx={boxStyle}>
    <Text bold align="right">To</Text>
    <Tabs>
      <svelte:fragment slot="tabs">
        <Tab _default />
        <Box inline p="none" cx={{ marginRight: '$lg', marginLeft: '$sm' }}
          >One of my accounts</Box
        >
        <Tab />
        <Box inline p="none" cx={{ marginRight: '$lg', marginLeft: '$sm' }}
          >Other account</Box
        >
      </svelte:fragment>
      <svelte:fragment slot="panels">
        <TabPanel>
          <Box px="none" cx={{ width: '300px' }}>
            <Select
              placeholder="Select personal account"
              handleSelect={handleSelectToAccount}
              options={accountList}
            />
          </Box>
        </TabPanel>
        <TabPanel
          ><Input
            bind:value={otherAccount}
            placeholder="Account address"
          /></TabPanel
        >
      </svelte:fragment>
    </Tabs>
  </Box>
  <Box cx={boxStyle}>
    <Text bold align="right">Amount</Text>
    <Box wrapper flex="row" items="baseline">
      <Box wrapper>
        <Input bind:value={amountToSend} placeholder="Amount" />
        <Text inline size="small" color="secondary">{getAmount()}</Text>
        <Text inline size="xsmall" muted>(Available balance)</Text>
      </Box>
      <Box px={'small'} cx={{ minWidth: '140px' }}>
        <Select
          placeholder="Select resource"
          handleSelect={handleSelectBalance}
          options={balanceList}
        />
      </Box>
    </Box>
  </Box>
  <Box justify="end">
    <Button
      disabled={!selectedFromAccount?.address ||
        !selectedToAccount?.address ||
        !amountToSend ||
        !selectedBalance?.address}
      on:click={() =>
        onSend({
          resource: selectedBalance.address,
          fromAccount: selectedFromAccount.address,
          toAccount: selectedToAccount.address || otherAccount,
          amount: Number(amountToSend)
        })}>Send</Button
    >
  </Box>
</Box>
