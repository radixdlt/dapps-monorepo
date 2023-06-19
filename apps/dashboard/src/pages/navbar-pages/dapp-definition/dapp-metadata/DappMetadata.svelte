<script lang="ts" context="module">
  export enum ValidationResult {
    LINKED,
    CANT_LINK,
    WILL_BE_LINKED,
    INVALID_INPUT
  }
</script>

<script lang="ts">
  import Button from '@components/_base/button/Button.svelte'
  import { writable } from 'svelte/store'
  import type { Account } from '@stores'
  import { query } from '@api/query'
  import SelectAccount from './rows/SelectAccount.svelte'
  import SetAsDApp from './rows/SetAsDApp.svelte'
  import Name from './rows/Name.svelte'
  import Description from './rows/Description.svelte'
  import {
    getFormattedAccounts,
    type FormattedAccount,
    getTxManifest
  } from '../side-effects'
  import { getFungibleResource } from '@api/utils/resources'
  import { XRD_NAME } from '@constants'
  import Text from '@components/_base/text/Text.svelte'
  import StackList from '@components/stack-list/StackList.svelte'
  import Entity, {
    type EntityT
  } from './rows/linking-metadata-list/Entity.svelte'
  import Website, {
    type WebsiteT
  } from './rows/linking-metadata-list/Website.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import TrashIcon from '@icons/trash.svg'

  export let accounts: Account[]

  const transactionManifest = (
    address: string,
    metadata: { key: string; value: unknown }[]
  ) => getTxManifest(address, $entities, metadata)

  const { send, response, loading } = query('sendTransaction')

  let formattedAccounts = writable<FormattedAccount[] | undefined>(undefined)

  const refreshAccounts = async () => {
    $formattedAccounts = await getFormattedAccounts(accounts)
  }

  $: if (accounts) refreshAccounts()

  $: if ($response) refreshAccounts()

  const update = async () => {
    let validationResults: ValidationResult[] = []

    for (const entity of $entities) {
      validationResults.push(
        await entity.validation!(
          $selectedAccount!.address,
          entityLinkedFromDapp(entity.address)!,
          $selectedAccount!.resources.nonFungible
        )
      )
    }

    for (const website of $websites) {
      validationResults.push(
        await website.validation!(
          $selectedAccount!.address,
          websiteLinkedFromDapp(website.url)!
        )
      )
    }

    if (
      validationResults.some((result) => result === ValidationResult.CANT_LINK)
    ) {
      return
    }

    if ($selectedAccount)
      send(
        transactionManifest($selectedAccount.address, [
          {
            key: 'name',
            value: $setAsDAppDefinition ? $dAppName : undefined
          },
          {
            key: 'description',
            value: $setAsDAppDefinition ? $dAppDescription : undefined
          },
          {
            key: 'claimed_websites',
            value: $setAsDAppDefinition ? $websites : undefined
          },
          {
            key: 'claimed_entities',
            value: $setAsDAppDefinition ? $entities : undefined
          },
          {
            key: 'account_type',
            value: $setAsDAppDefinition ? 'dapp definition' : 'account'
          }
        ])
      )
  }

  const selectedAccount = writable<FormattedAccount | undefined>(undefined)
  const setAsDAppDefinition = writable(false)
  const dAppName = writable('')
  const dAppDescription = writable('')

  const claimedWebsites = writable<string[]>([])
  const claimedEntities = writable<string[]>([])

  const websites = writable<WebsiteT[]>([])
  const entities = writable<EntityT[]>([])

  let faded = writable(false)
  let isDappDefinition = writable(false)

  $: {
    if ($selectedAccount) {
      $dAppName = $selectedAccount.name || ''
      $dAppDescription = $selectedAccount.description || ''
      $claimedWebsites = $selectedAccount.claimedWebsites || []
      $claimedEntities = $selectedAccount.claimedEntities || []
    }
  }

  $: $websites = $claimedWebsites.map((website) => ({
    url: website
  }))

  $: $entities = $claimedEntities.map((entity) => ({
    address: entity
  }))

  $: if ($selectedAccount)
    isDappDefinition.set(!!$selectedAccount.dappDefinition)

  $: if ($selectedAccount) $setAsDAppDefinition = $isDappDefinition
  $: faded.set(!$setAsDAppDefinition)

  let XRDAmount: Promise<string | undefined> = new Promise((_) => {})

  let showNotEnoughXRDError = false

  $: if (XRDAmount?.then)
    XRDAmount.then((amount) => {
      showNotEnoughXRDError = !amount || Number(amount) < 10
    })

  $: if ($selectedAccount)
    XRDAmount = getFungibleResource(XRD_NAME)($selectedAccount.resources)?.value

  const entityLinkedFromDapp = (entity: string) =>
    $selectedAccount?.claimedEntities?.includes(entity)

  const websiteLinkedFromDapp = (website: string) =>
    $selectedAccount?.claimedWebsites?.includes(website)

  const validateWebsite = async (i: number) => {
    // desparate hack, need to refactor
    await setTimeout(() => {}, 1000)

    $websites[i]!.validation?.(
      $selectedAccount!.address,
      websiteLinkedFromDapp($websites[i]!.url)!
    )
  }

  $claimedWebsites.forEach((_, i) => {
    validateWebsite(i)
  })

  const validateEntity = async (i: number) => {
    // desparate hack, need to refactor
    await setTimeout(() => {}, 1000)

    $entities[i]!.validation?.(
      $selectedAccount!.address,
      entityLinkedFromDapp($entities[i]!.address)!,
      $selectedAccount!.resources.nonFungible
    )
  }

  $: $claimedEntities.forEach((_, i) => {
    validateEntity(i)
  })
</script>

<div class="grid">
  <div style:padding-top="0.5rem" class="left-column-text">
    Select an Account
  </div>

  <div>
    <SelectAccount
      accounts={$formattedAccounts}
      bind:selectedAccount={$selectedAccount}
      bind:showError={showNotEnoughXRDError}
    />

    <SetAsDApp
      isDappDefinition={$isDappDefinition}
      bind:isChecked={$setAsDAppDefinition}
    />

    <div
      style:margin-top="var(--space-xl)"
      style:margin-bottom="var(--space-sm)"
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

  <div class:faded={$faded}>
    <Text size="small" cx={{ marginBottom: '1rem' }}>
      Configuring your dApp Definition with the websites your dApp uses is a
      requirement of the Radix Wallet so that it it can catch “fake” websites
      claiming to be part of your dApp.
    </Text>

    <StackList
      let:i
      on:add={() => ($websites = [...$websites, { url: '' }])}
      bind:inputs={$websites}
    >
      <Website
        bind:website={$websites[i]}
        disabled={i < $claimedWebsites.length}
        faded={$faded}
      />
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
      on:add={() => ($entities = [...$entities, { address: '' }])}
      bind:inputs={$entities}
    >
      <Entity
        bind:entity={$entities[i]}
        disabled={i < $claimedEntities.length}
      />
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
</div>
<div class="update-button">
  <Button on:click={update}>
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
    gap: var(--space-md);
    height: 100%;
  }

  .left-column-text {
    font-weight: bold;
    text-align: right;
  }

  .update-button {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-xl);
  }
</style>
