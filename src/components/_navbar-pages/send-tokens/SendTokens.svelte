<script lang="ts">
  import Text from '@components/_base/text/Text.svelte'
  import Select, { type Option } from '@components/_base/select/Select.svelte'
  import Tabs from '@components/_base/tabs/Tabs.svelte'
  import TabPanel from '@components/_base/tabs/TabPanel.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import { goto } from '$app/navigation'
  import RadioTab from '@components/_base/tabs/types/RadioTab.svelte'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'
  import { getPopulatedResources, type Resources } from '@api/utils/resources'

  type OptionsType = Option<{ address: string }>

  export let accounts: OptionsType[]

  let transformedOverview: Promise<Resources> = new Promise((resolve) => {})

  $: if (selectedFromAccount)
    transformedOverview = getPopulatedResources(selectedFromAccount.address)

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

<div class="grid">
  <div class="from-title">
    <Text bold align="right">From</Text>
  </div>
  <div class="dropdown">
    <Select bind:selected={selectedFromAccount} options={accounts} />
  </div>

  <div class="to-title">
    <Text bold align="right">To</Text>
  </div>
  <div class="to">
    <Tabs>
      <svelte:fragment slot="tabs">
        <RadioTab />
        <div class="to-account-option">One of My Accounts</div>
        <RadioTab />
        <div class="to-account-option">Other account</div>
      </svelte:fragment>
      <svelte:fragment slot="panels">
        <TabPanel>
          <div class="dropdown">
            <Select
              placeholder="Select account"
              bind:selected={selectedToAccount}
              options={accounts}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div class="account-input">
            <Input
              type="text"
              bind:value={otherAccount}
              placeholder="Account Address"
            />
          </div>
        </TabPanel>
      </svelte:fragment>
    </Tabs>
  </div>

  <slot
    selectedFromAccount={selectedFromAccount?.address}
    selectedToAccount={selectedToAccount?.address || otherAccount}
    resources={transformedOverview}
    {setTransactionManifest}
    {setResourceSelected}
  />

  <div style:grid-area="send" class="send-btn">
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
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid:
      'from-title   from'
      'to-title     to'
      'amount-title amount'
      '.            send'
      / 5em auto;
    gap: var(--space-lg);
    background-color: var(--surface);
  }

  .from-title {
    grid-area: from-title;
    align-self: center;
  }

  .to-title {
    grid-area: to-title;
  }

  .to {
    grid-area: to;
  }

  .to-account-option {
    display: inline-flex;
    margin: 0 0 var(--space-lg) var(--space-sm);
  }

  .account-input {
    width: 300px;
  }

  .dropdown {
    grid-area: from;
    width: 300px;
  }

  .send-btn {
    display: flex;
    justify-content: end;
  }
</style>
