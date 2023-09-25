<script lang="ts">
  import Button from '@components/_base/button/ButtonNew.svelte'
  import { writable } from 'svelte/store'
  import type { Account } from '@stores'
  import { query } from '@api/query'
  import {
    getFormattedAccounts,
    type FormattedAccount,
    getTxManifest
  } from './side-effects'
  import Text from '@components/_base/text/Text.svelte'
  import StackList from '@components/stack-list/StackList.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import TrashIcon from '@icons/trash.svg'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'
  import type { Account as AccountType } from '@stores'

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
          icon_url: $dAppIcon,
          dapp_definitions: $dAppDefinitions,
          tags: $dAppTags.split(','),
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
  const dAppIcon = writable('')
  const dAppTags = writable('')

  const claimedWebsites = writable<string[]>([])
  const claimedEntities = writable<string[]>([])

  const websites = writable<string[]>([])
  const entities = writable<string[]>([])
  const badges = writable<string[]>([])
  const dAppDefinitions = writable<string[]>([])

  let faded = writable(false)
  let isDappDefinition = writable(false)

  $: {
    if ($selectedAccount) {
      $dAppName = $selectedAccount.name || ''
      $dAppDescription = $selectedAccount.description || ''
      $dAppIcon = $selectedAccount.iconUrl || ''
      $claimedWebsites = $selectedAccount.claimedWebsites || []
      $claimedEntities = $selectedAccount.claimedEntities || []
      $dAppDefinitions = $selectedAccount.dAppDefinitions || []
      $badges = []
    }
  }

  $: $websites = $claimedWebsites

  $: $entities = $claimedEntities

  $: if ($selectedAccount)
    isDappDefinition.set(!!$selectedAccount.dappDefinition)

  $: if ($selectedAccount) $setAsDAppDefinition = $isDappDefinition
  $: faded.set(!$setAsDAppDefinition)

  let selected: AccountType

  $: if (selected) {
    $selectedAccount = $formattedAccounts?.find(
      (account) => account.address === selected.address
    )
  }
</script>

<div class="description">
  <div>
    A dApp Definition is a Radix Account that acts as a unique registration for
    everything associated with your dApp. This is done using special metadata
    that declares the account as a dApp Definition and includes other metadata
    fields that allow apps like the Radix Wallet to <a
      href="https://docs-babylon.radixdlt.com/main/standards/metadata-for-wallet-display.html"
      target="_blank">display useful information about your dApp</a
    >
    and
    <a
      href="https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html"
      target="_blank">its association to websites, components, and resources</a
    >. After you create an account in the Radix Wallet, here you can set it as a
    dApp Definition and configure its metadata.
  </div>
</div>

<div>
  Note: <strong
    >Website linking is especially important, as the Radix Wallet will not
    accept requests from dApp websites that are not correctly configured</strong
  >.
  <a
    href="https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html#_declaration_and_handling_of_claimed_websites"
    target="_blank">see the docs for more information on website linking</a
  >.
</div>

<div class="card">
  <div class="grid">
    <div style:padding-top="0.5rem" class="left-column-text">
      Select an Account
    </div>

    <div>
      <div class="account-picker">
        <AccountPicker bind:selected />
      </div>

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
          This Account is a dApp Definition
        </Checkbox>
      </div>

      <div
        style:margin-top="var(--spacing-xl)"
        style:margin-bottom="var(--spacing-sm)"
        class:faded={$faded}
      >
        <div style:font-weight="bold" class:faded={$faded}>
          Metadata for Display
        </div>
        <div class:faded={$faded}>
          These metadata fields let the Radix Wallet tell the user about your
          dApp.
        </div>
        <a
          class:faded={$faded}
          href="https://docs-babylon.radixdlt.com/main/standards/metadata-for-wallet-display.html"
          target="_blank">More information</a
        >
      </div>
    </div>

    <div
      style:padding-top="0.5rem"
      class:faded={$faded}
      class="left-column-text"
    >
      name
    </div>

    <div>
      <input
        disabled={$faded}
        on:input
        type="text"
        bind:value={$dAppName}
        placeholder="dApp name (may be truncated after 32 characters)"
      />
    </div>

    <div
      style:padding-top="0.5rem"
      class:faded={$faded}
      class="left-column-text"
    >
      description
    </div>

    <div>
      <textarea
        disabled={$faded}
        bind:value={$dAppDescription}
        placeholder="dApp description (may be truncated after 256 characters)"
        maxlength={258}
      />
    </div>

    <div
      style:padding-top="0.5rem"
      class:faded={$faded}
      class="left-column-text"
    >
      icon_url
    </div>

    <div>
      <input
        disabled={$faded}
        on:input
        type="text"
        bind:value={$dAppIcon}
        placeholder="jpg, png, gif (will be cropped to 1:1 square)"
      />
    </div>

    <div style:padding-top="0.5rem" class="left-column-text" />

    <div
      style:margin-top="var(--spacing-xl)"
      style:margin-bottom="var(--spacing-sm)"
      class:faded={$faded}
    >
      <div style:font-weight="bold" class:faded={$faded}>
        Metadata for Verification
      </div>
      <div class:faded={$faded}>
        These metadata fields let the Radix Wallet show packages, components,
        and resources as parts of your dApp. To verify the association, a
        similar metadata field must also be set on each entity linking it back
        to this dApp Definition.
      </div>
      <a
        class:faded={$faded}
        href="https://docs-babylon.radixdlt.com/main/standards/metadata-for-verification.html"
        target="_blank">More information</a
      >
    </div>

    <div class="left-column-text" class:faded={$faded}>Linked Websites</div>

    <div class:faded={$faded}>
      <StackList
        let:i
        on:add={() => {
          if ($isDappDefinition) $websites = [...$websites, '']
        }}
        bind:inputs={$websites}
      >
        <div class="input">
          <input
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
            <Icon
              icon={TrashIcon}
              width="xs"
              height="xs"
              interactive
              filter=""
            />
          {/if}
        </div>
      </StackList>
    </div>

    <div class="left-column-text" class:faded={$faded}>claimed_entitites</div>

    <div>
      <StackList
        let:i
        on:add={() => {
          if ($isDappDefinition) $entities = [...$entities, '']
        }}
        bind:inputs={$entities}
      >
        <div class="input">
          <input
            type="text"
            on:input
            bind:value={$entities[i]}
            placeholder="Account, package, resource or component address"
          />
        </div>

        <div slot="add-button" style:opacity={$faded ? '0%' : '100%'}>
          <Text pointer color="link">+ Add a claimed entity</Text>
        </div>
        <div slot="remove-button">
          {#if !$faded}
            <Icon
              icon={TrashIcon}
              width="xs"
              height="xs"
              interactive
              filter=""
            />
          {/if}
        </div>
      </StackList>
    </div>

    <div class="left-column-text" class:faded={$faded}>dapp_definitions</div>

    <div>
      <StackList
        let:i
        on:add={() => {
          if ($isDappDefinition) $dAppDefinitions = [...$dAppDefinitions, '']
        }}
        bind:inputs={$dAppDefinitions}
      >
        <div class="input">
          <input
            type="text"
            on:input
            bind:value={$dAppDefinitions[i]}
            placeholder="dApp definition address"
          />
        </div>

        <div slot="add-button" style:opacity={$faded ? '0%' : '100%'}>
          <Text pointer color="link">+ Add an associated dApp Definition</Text>
        </div>
        <div slot="remove-button">
          {#if !$faded}
            <Icon
              icon={TrashIcon}
              width="xs"
              height="xs"
              interactive
              filter=""
            />
          {/if}
        </div>
      </StackList>
    </div>

    <div style:padding-top="0.5rem" class="left-column-text" />

    <div
      style:margin-top="var(--spacing-xl)"
      style:margin-bottom="var(--spacing-sm)"
      class:faded={$faded}
    >
      <div style:font-weight="bold" class:faded={$faded}>
        Metadata for Verification
      </div>
      <div class:faded={$faded}>
        Claimed Entity Verification Badges This dApp will attempt to set
        corresponding metadata on any claimed_entities above to complete the
        2-way linking. Please enter the full resource address of any badges that
        you hold that will be needed in the transaction to set metadata on these
        entities.
      </div>
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
          <input
            type="text"
            on:input
            bind:value={$badges[i]}
            placeholder="Resource address"
          />
        </div>
        <div slot="add-button" style:opacity={$faded ? '0%' : '100%'}>
          <Text pointer color="link"
            >+ Add a badge to present in this transaction</Text
          >
        </div>
        <div slot="remove-button">
          {#if !$faded}
            <Icon
              icon={TrashIcon}
              width="xs"
              height="xs"
              interactive
              filter=""
            />
          {/if}
        </div>
      </StackList>
    </div>
  </div>
</div>
<div class="update-button">
  <Button on:click={update} size="big">
    {#if $loading}
      <div style:height="60%" style:aspect-ratio="1/1">
        <LoadingSpinner />
      </div>
    {:else}
      Send Update Transaction to the Radix Wallet
    {/if}
  </Button>
</div>

<style lang="scss">
  .account-picker {
    max-width: 25rem;
  }
  .card {
    margin-top: 1rem;
    padding: 2rem;
    margin-bottom: 1rem;
  }
  .description {
    div {
      margin-bottom: 1rem;
    }
  }
  .content {
    background: var(--theme-surface-2);
    padding: var(--spacing-xl);
    margin-top: var(--space-xl);
    max-width: 800px;
  }
  .faded {
    color: var(--colors-muted);
  }

  .grid {
    display: grid;
    grid-template-columns: 10rem 4fr;
    gap: 0.85rem;
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
    margin-bottom: 1rem;
  }
  .input {
    width: var(--sizes-6xl);
  }
  input,
  textarea {
    background-color: var(--theme-surface-1);
    border: none;
    padding: 0.5rem;
    width: 100%;
    border-bottom: 1px solid var(--theme-surface-3);
  }
</style>
