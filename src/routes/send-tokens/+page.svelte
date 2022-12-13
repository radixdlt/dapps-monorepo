<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Select, { type Options } from '@components/_base/select/Select.svelte'
  import Tab from '@components/_base/tabs/Tab.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { css } from '@styles'

  const people = [
    { id: '1', label: 'XRD', unavailable: false },
    { id: '2', label: 'Kenton Towne', unavailable: false },
    { id: '3', label: 'Therese Wunsch', unavailable: false },
    { id: '4', label: 'Benedict Kessler', unavailable: true },
    { id: '5', label: 'Katelyn Rohan', unavailable: false }
  ]

  let selectedFromAccount: Options = people[0]

  const handleSelectFromAccount = (nextSelected: Options) => {
    selectedFromAccount = nextSelected
  }

  let otherAccount = ''

  const divider = css({
    border: '1px solid $borderColor',
    mt: '$xl'
  })()
</script>

<Box transparent>
  <Text inline size="xxlarge" mb="medium" bold>Send Tokens</Text>
  <Card>
    <Text inline slot="header">From/To</Text>
    <Box
      mt="medium"
      slot="body"
      cx={{
        gap: '$xl',
        width: '60%',
        display: 'grid',
        gridTemplateColumns: '100px auto',
        alignItems: 'baseline'
      }}
    >
      <Text>From</Text>
      <Box p="none">
        <Select
          handleSelect={handleSelectFromAccount}
          options={people}
          selected={selectedFromAccount}
        />
        <div class={divider} />
      </Box>
      <Text>To</Text>
      <Box p="none">
        <Tabs>
          <svelte:fragment slot="tabs">
            <Tab>One of my accounts</Tab>
            <Tab>Other account</Tab>
          </svelte:fragment>
          <svelte:fragment slot="panels">
            <TabPanel>
              <Select
                handleSelect={handleSelectFromAccount}
                options={people}
                selected={selectedFromAccount}
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
        <div class={divider} />
      </Box>
      <Text>Amount</Text>
      <Box p="none" flex="row" items="baseline">
        <Box p="none" cx={{ minWidth: '100px' }}>
          <Select
            handleSelect={handleSelectFromAccount}
            options={people}
            selected={selectedFromAccount}
          />
        </Box>
        <Box>
          <Input placeholder="Amount" />
          <Text inline size="small" color="secondary">0.00</Text>
          <Text inline size="xsmall" muted>(Available balance)</Text>
        </Box>
      </Box>
    </Box>
  </Card>
</Box>
