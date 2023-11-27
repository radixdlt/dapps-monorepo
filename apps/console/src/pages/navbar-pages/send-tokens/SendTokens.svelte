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
  import Label from '@components/../dev-console/form/Label.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Input from '@components/../dev-console/form/Input.svelte'
  import Select from '@components/../dev-console/form/Select.svelte'
  import { goto } from '$app/navigation'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'
  import {
    getAccountData,
    type Resources,
    type TransformedNonFungible
  } from '@api/utils/entities/resource'
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'
  import type { Account } from '@stores'
  import { shortenAddress } from '@utils'
  import { createBadgeProof } from '../dapp-definition/side-effects'
  import { address } from '@radixdlt/radix-engine-toolkit'

  let resources: Promise<Resources[number]> = new Promise((resolve) => {})

  $: if (selectedFromAccount) {
    resources = getAccountData([selectedFromAccount.address]).then(
      (resources) => resources[0]!
    )
  }

  let selectedFromAccount: Account
  let selectedToAccount: Account

  let selectedProof = 'none'
  let otherAccount = ''
  let depositTo = 'myAccount'

  let resourceSelected = false

  let transactionManifest: string

  let setTransactionManifest = (manifest: string) =>
    (transactionManifest = manifest)

  const setResourceSelected = (selected: boolean) =>
    (resourceSelected = selected)

  const mapNonFungibles = (nonFungible: TransformedNonFungible[]) => {
    return nonFungible.flatMap((nonFungible) => {
      return nonFungible.nonFungibles.map((nft: any) => {
        return {
          label: `${nonFungible.resource.displayName} - ${nft.id}`,
          id: `${nonFungible.resource.address}:${nft.id}`
        }
      })
    })
  }
</script>

<Box bgColor="surface" flex="row" gap="large">
  <div class="section">
    <div class="form-item">
      <Label>Withdraw From</Label>

      <AccountPicker bind:selected={selectedFromAccount} />
    </div>

    <slot
      selectedFromAccount={selectedFromAccount?.address}
      selectedToAccount={selectedToAccount?.address || otherAccount}
      {resources}
      {setTransactionManifest}
      {setResourceSelected}
    />

    <div class="form-item">
      <Label>Create Proof From</Label>
      {#await resources}
        <Select loading={true} />
      {:then data}
        <Select
          placeholder="Select Resource"
          bind:selected={selectedProof}
          items={[
            { label: 'None', id: 'none' },
            ...data.fungible.map((fungible) => ({
              label: `${
                fungible.metadata.standard.name?.value || ''
              } (${shortenAddress(fungible.address)})`,
              id: fungible.address
            })),
            ...mapNonFungibles(data.nonFungible)
          ]}
        />
      {/await}
    </div>
  </div>
  <div class="section">
    <Label>Deposit To</Label>
    <Select
      placeholder="Deposit To"
      bind:selected={depositTo}
      items={[
        { label: 'My Account', id: 'myAccount' },
        { label: 'Other Account', id: 'otherAccount' }
      ]}
    />
    <div class="spacing">
      {#if depositTo === 'otherAccount'}
        <Input bind:value={otherAccount} placeholder="Account Address" />
      {:else if depositTo === 'myAccount'}
        <AccountPicker bind:selected={selectedToAccount} />
      {/if}
    </div>
  </div>
</Box>
<div class="spacing">
  <SendTxButton
    buttonProps={{
      disabled: !(
        selectedFromAccount?.address &&
        (selectedToAccount?.address || otherAccount.length > 0) &&
        resourceSelected
      ),
      size: 'big'
    }}
    on:click={(e) =>
      e.detail(
        selectedProof && selectedProof !== 'none'
          ? [
              createBadgeProof([selectedProof], selectedFromAccount.address),
              transactionManifest
            ].join('\n')
          : transactionManifest
      )}
    on:response={(e) =>
      goto(
        `/send-tokens/success?txID=${e.detail.transactionIntentHash}&txStatus=${e.detail.status}`
      )}
  />
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    gap: var(--spacing-xl);
  }
  .section {
    flex-grow: 1;
  }
  .spacing {
    margin-top: var(--spacing-xl);
  }
  .form-item {
    margin-bottom: var(--spacing-2xl);
  }
</style>
