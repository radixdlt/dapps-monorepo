<script lang="ts" context="module">
  export type FormattedAccount = Account & {
    dappDefinition: boolean
    name?: string
    description?: string
    domain?: string
  }
</script>

<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import { writable } from 'svelte/store'
  import type { Account } from '@stores'
  import { query } from '@api/query'
  import Text from '@components/_base/text/Text.svelte'
  import Row from '@components/info-box/Row.svelte'
  import SelectAccount from './rows/SelectAccount.svelte'
  import SetAsDApp from './rows/SetAsDApp.svelte'
  import Name from './rows/Name.svelte'
  import Description from './rows/Description.svelte'
  import Domain from './rows/Domain.svelte'
  import { getFormattedAccounts } from './side-effects'
  import HeaderRow from '../../info-box/HeaderRow.svelte'
  import {
    getFungibleResource,
    getPopulatedResources,
    type Resources
  } from '@api/utils/resources'
  import { getEntityOverview } from '@api/gateway'

  export let accounts: Account[]

  $: resources = accounts.reduce((prev, cur) => {
    return new Promise((resolve, _) =>
      prev.then(async (obj) => {
        const resources = await getPopulatedResources(cur.address)
        obj[cur.address] = resources
        resolve(obj)
      })
    )
  }, Promise.resolve({}) as Promise<Record<string, Resources>>)

  const infoBoxPadding = '6px'

  const transactionManifest = (
    address: string,
    metadata: { key: string; value: unknown }[]
  ) =>
    metadata.reduce(
      (prev, cur) =>
        prev +
        `
            SET_METADATA
              ComponentAddress("${address}")
              "${cur.key}"
              "${cur.value}";      
            `,
      ``
    )

  const { send, response, loading } = query('sendTransaction')

  let formattedAccounts = writable<FormattedAccount[] | undefined>(undefined)

  const refreshAccounts = () => {
    getEntityOverview(accounts.map((acc) => acc.address)).then((overview) => {
      $formattedAccounts = getFormattedAccounts(accounts, overview)
    })
  }

  $: if (accounts) refreshAccounts()

  $: if ($response) refreshAccounts()

  const update = () => {
    if ($selectedAccount)
      send(
        transactionManifest($selectedAccount.address, [
          {
            key: 'name',
            value: $setAsDAppDefinition ? $dAppName : ''
          },
          {
            key: 'description',
            value: $setAsDAppDefinition ? $dAppDescription : ''
          },
          {
            key: 'related_websites',
            value: $setAsDAppDefinition ? $relatedWebsites : ''
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
  const relatedWebsites = writable('')
  let faded = writable(false)
  let isDappDefinition = writable(false)

  $: {
    if ($selectedAccount) {
      dAppName.set($selectedAccount.name || '')
      dAppDescription.set($selectedAccount.description || '')
      relatedWebsites.set($selectedAccount.domain || '')
    }
  }

  $: if ($selectedAccount)
    isDappDefinition.set(!!$selectedAccount.dappDefinition)

  $: if ($selectedAccount) $setAsDAppDefinition = $isDappDefinition
  $: faded.set(!$setAsDAppDefinition)

  let XRDAmount: Promise<string> = new Promise((_) => {})

  let showNotEnoughXRDError = false

  $: XRDAmount.then((amount) => {
    showNotEnoughXRDError = Number(amount) < 10
  })

  $: if ($selectedAccount)
    XRDAmount = resources
      .then((resources) => resources[$selectedAccount!.address]!)
      .then((resources) => getFungibleResource('XRD')(resources)!.value)
</script>

<Box my="medium" cx={{ width: '80%' }} wrapper>
  <Text size="small">
    A dApp Definition is a Radix account that acts as a unique registration for
    everything associated with your dApp. This account has special metadata that
    declares it as a dApp Definition and allows apps like the Radix Wallet to
    verify its association to domains, components, and resources. After you
    create an account in the Radix Wallet, here you can set it as a dApp
    Definition and configure it.
  </Text>
</Box>

<Box bgColor="surface">
  <InfoBox>
    <Row text="Select Account" paddingTop={infoBoxPadding}>
      <SelectAccount
        slot="right"
        accounts={$formattedAccounts}
        bind:selectedAccount={$selectedAccount}
        bind:showError={showNotEnoughXRDError}
      />
    </Row>

    {#await XRDAmount then amount}
      {#if parseInt(amount) < 10}
        <HeaderRow
          header="Please deposit some XRD to this account. On betanet, the account to be set as a dApp Definition must have XRD to pay the network fees for that metadata update. On mainnet, the Radix Wallet will allow payment of these fees from other accounts."
          faded={$faded}
        />
      {/if}
    {/await}

    <Row text="dApp Setup" paddingTop="15px">
      <SetAsDApp
        slot="right"
        isDappDefinition={$isDappDefinition}
        bind:isChecked={$setAsDAppDefinition}
      />
    </Row>

    <HeaderRow header="Informational Metadata" />

    <Row text="Name" faded={$faded} paddingTop={infoBoxPadding}>
      <Name slot="right" faded={$faded} bind:name={$dAppName} />
    </Row>

    <Row text="Description" faded={$faded}>
      <Description
        slot="right"
        faded={$faded}
        bind:description={$dAppDescription}
      />
    </Row>

    <HeaderRow header="Linking Metadata" faded={$faded} />

    <Row text="Related Websites" faded={$faded} paddingTop={infoBoxPadding}>
      <Domain slot="right" faded={$faded} bind:domain={$relatedWebsites} />
    </Row>
  </InfoBox>
  <Box justify="end">
    <Button disabled={$loading} on:click={update} loading={$loading}
      >Update</Button
    >
  </Box>
</Box>
