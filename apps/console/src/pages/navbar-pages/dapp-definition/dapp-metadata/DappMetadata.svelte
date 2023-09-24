<script lang="ts">
  import Button from '@components/_base/button/ButtonNew.svelte'
  import { writable } from 'svelte/store'
  import type { Account } from '@stores'
  import { query } from '@api/query'
  import SelectAccount from './rows/SelectAccount.svelte'
  import Name from './rows/Name.svelte'
  import Description from './rows/Description.svelte'
  import {
    getFormattedAccounts,
    type FormattedAccount,
    getTxManifest
  } from '../side-effects'
  import Text from '@components/_base/text/Text.svelte'
  import StackList from '@components/stack-list/StackList.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import TrashIcon from '@icons/trash.svg'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import Input from '@components/_base/input/Input.svelte'

  export let accounts: Account[]

  const { send, response, loading } = query('sendTransaction')

  let formattedAccounts = writable<FormattedAccount[] | undefined>(undefined)

  const refreshAccounts = async () => {
    $formattedAccounts = await getFormattedAccounts(accounts)
  }

  $: if (accounts) refreshAccounts()

  $: if ($response) refreshAccounts()

  const update = async () => {
    if ($selectedAccount)
      send(
        getTxManifest({
          isDappDefinitionAccount: $isDappDefinition,
          dAppDefinitionAddress: $selectedAccount.address,
          name: $dAppName,
          description: $dAppDescription,
          claimedWebsites: $websites,
          claimedEntities: $entities,
          badges: $badges
        })
      )
  }

  const selectedAccount = writable<FormattedAccount | undefined>(undefined)
  const setAsDAppDefinition = writable(false)
  const dAppName = writable('')
  const dAppDescription = writable('')

  const claimedWebsites = writable<string[]>([])
  const claimedEntities = writable<string[]>([])

  const websites = writable<string[]>([])
  const entities = writable<string[]>([])
  const badges = writable<string[]>([])

  let faded = writable(false)
  let isDappDefinition = writable(false)

  $: {
    if ($selectedAccount) {
      $dAppName = $selectedAccount.name || ''
      $dAppDescription = $selectedAccount.description || ''
      $claimedWebsites = $selectedAccount.claimedWebsites || []
      $claimedEntities = $selectedAccount.claimedEntities || []
      $badges = []
    }
  }

  $: $websites = $claimedWebsites

  $: $entities = $claimedEntities

  $: if ($selectedAccount)
    isDappDefinition.set(!!$selectedAccount.dappDefinition)

  $: if ($selectedAccount) $setAsDAppDefinition = $isDappDefinition
  $: faded.set(!$setAsDAppDefinition)
</script>

<div class="grid">
  <div style:padding-top="0.5rem" class="left-column-text">
    Select an Account
  </div>

  <div style:width="32rem">
    <SelectAccount
      accounts={$formattedAccounts}
      bind:selectedAccount={$selectedAccount}
    />

    <div class="dapp-definition-checkbox">
      <Checkbox
        bind:checked={$isDappDefinition}
        on:checked={() => {
          $setAsDAppDefinition = true
        }}
        on:unchecked={() => {
          $setAsDAppDefinition = false
        }}
      >
        This account is a dApp definition
      </Checkbox>
    </div>

    <div
      style:margin-top="var(--spacing-xl)"
      style:margin-bottom="var(--spacing-sm)"
      style:font-weight="bold"
      class:faded={$faded}
    >
      dApp Definition Information
    </div>
    <Text size="small" muted={$faded}>
      This provides metadata that the Radix Wallet can use to tell the user
      about your dApp.
    </Text>
  </div>

  <div style:padding-top="0.5rem" class:faded={$faded} class="left-column-text">
    Name
  </div>

  <Name bind:name={$dAppName} faded={$faded} />

  <div style:padding-top="0.5rem" class:faded={$faded} class="left-column-text">
    Description
  </div>

  <Description bind:description={$dAppDescription} faded={$faded} />

  <div class="left-column-text" class:faded={$faded}>Linked Websites</div>

  <div class:faded={$faded} style:width="32rem">
    <Text size="small" cx={{ marginBottom: '1rem' }}>
      Configuring your dApp Definition with the websites your dApp uses is a
      requirement of the Radix Wallet so that it it can catch “fake” websites
      claiming to be part of your dApp.
    </Text>

    <StackList
      let:i
      on:add={() => {
        if ($isDappDefinition) $websites = [...$websites, '']
      }}
      bind:inputs={$websites}
    >
      <div class="input">
        <Input
          type="text"
          on:input
          bind:value={$websites[i]}
          placeholder="Example: https://www.radixdlt.com"
        />
      </div>

      <div slot="add-button" style:opacity={$faded ? '0%' : '100%'}>
        <Text pointer color="link">+ Add a Linked Website</Text>
      </div>

      <div slot="remove-button">
        {#if !$faded}
          <Icon icon={TrashIcon} width="xs" height="xs" interactive filter="" />
        {/if}
      </div>
    </StackList>
  </div>

  <div class="left-column-text" class:faded={$faded}>Linked Entities</div>

  <div>
    <StackList
      let:i
      on:add={() => {
        if ($isDappDefinition) $entities = [...$entities, '']
      }}
      bind:inputs={$entities}
    >
      <div class="input">
        <Input
          type="text"
          on:input
          bind:value={$entities[i]}
          placeholder="Account, package, resource or component address"
        />
      </div>

      <div slot="add-button" style:opacity={$faded ? '0%' : '100%'}>
        <Text pointer color="link">+ Add a Linked Entity</Text>
      </div>
      <div slot="remove-button">
        {#if !$faded}
          <Icon icon={TrashIcon} width="xs" height="xs" interactive filter="" />
        {/if}
      </div>
    </StackList>
  </div>

  <div class="left-column-text" class:faded={$faded}>Present badges</div>

  <div>
    <StackList
      let:i
      on:add={() => {
        if ($isDappDefinition) $badges = [...$badges, '']
      }}
      bind:inputs={$badges}
    >
      <div class="input">
        <Input
          type="text"
          on:input
          bind:value={$badges[i]}
          placeholder="Resource address"
        />
      </div>
      <div slot="add-button" style:opacity={$faded ? '0%' : '100%'}>
        <Text pointer color="link">+ Add a Badge</Text>
      </div>
      <div slot="remove-button">
        {#if !$faded}
          <Icon icon={TrashIcon} width="xs" height="xs" interactive filter="" />
        {/if}
      </div>
    </StackList>
  </div>
</div>
<div class="update-button">
  <Button on:click={update} size="big">
    {#if $loading}
      <div style:height="60%" style:aspect-ratio="1/1">
        <LoadingSpinner />
      </div>
    {:else}
      Update Account
    {/if}
  </Button>
</div>

<style>
  .faded {
    color: var(--colors-muted);
  }

  .grid {
    display: grid;
    grid-template-columns: 10rem 4fr;
    gap: var(--spacing-md);
    height: 100%;
  }

  .left-column-text {
    font-weight: bold;
    text-align: right;
  }

  .update-button {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }

  .dapp-definition-checkbox {
    margin-top: var(--spacing-md);
  }
  .input {
    width: var(--sizes-6xl);
  }
</style>
