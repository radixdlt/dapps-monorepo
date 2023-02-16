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
  import { getOverview } from '@api/gateway'
  import Text from '@components/_base/text/Text.svelte'
  import Row from '@components/info-box/Row.svelte'
  import SelectAccount from './rows/SelectAccount.svelte'
  import SetAsDApp from './rows/SetAsDApp.svelte'
  import Name from './rows/Name.svelte'
  import Description from './rows/Description.svelte'
  import Domain from './rows/Domain.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import { getFormattedAccounts } from './side-effects'
  import HeaderRow from '../../info-box/HeaderRow.svelte'

  export let accounts: Account[]

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

  $: getOverview(accounts.map((acc) => acc.address)).then((overview) => {
    formattedAccounts.set(getFormattedAccounts(accounts, overview))
  })

  const update = () => {
    if ($selectedAccount)
      send(
        transactionManifest($selectedAccount.address, [
          {
            key: 'name',
            value: setAsDAppDefinition ? $dAppName : ''
          },
          {
            key: 'description',
            value: setAsDAppDefinition ? $dAppDescription : ''
          },
          {
            key: 'domain',
            value: setAsDAppDefinition ? $domain : ''
          },
          {
            key: 'account_type',
            value: setAsDAppDefinition ? 'dapp definition' : 'account'
          }
        ])
      )
  }

  const selectedAccount = writable<FormattedAccount | undefined>(undefined)
  const setAsDAppDefinition = writable(false)
  const dAppName = writable('')
  const dAppDescription = writable('')
  const domain = writable('')
  let faded = writable(false)
  let isDappDefinition = writable(false)

  $: {
    if ($selectedAccount) {
      dAppName.set($selectedAccount.name || '')
      dAppDescription.set($selectedAccount.description || '')
      domain.set($selectedAccount.domain || '')
    }
  }

  $: isDappDefinition.set(!!$selectedAccount?.dappDefinition)

  $: faded.set(!$setAsDAppDefinition)
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
    <Row text="Select Account">
      <SelectAccount
        slot="right"
        accounts={$formattedAccounts}
        bind:selectedAccount={$selectedAccount}
      />
    </Row>

    <Row text="dApp Setup" paddingTop="15px">
      <SetAsDApp
        slot="right"
        isDappDefinition={$isDappDefinition}
        bind:isChecked={$setAsDAppDefinition}
      />
    </Row>

    <HeaderRow header="Informational Metadata" faded={$faded} />

    <Row text="Name" faded={$faded}>
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

    <Row text="Domain" faded={$faded}>
      <Domain slot="right" faded={$faded} bind:domain={$domain} />
    </Row>
  </InfoBox>
  <Box justify="end">
    {#if $loading}
      <Button><LoadingSpinner /></Button>
    {:else}
      <Button on:click={update}>Update</Button>
    {/if}
  </Box>
</Box>
