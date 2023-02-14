<script lang="ts" context="module">
  export const context = useContext<{
    selectedAccount: (acc: FormattedAccount) => void
    asDAppDefinition: (bool: boolean) => void
    dAppName: Writable<string>
    dAppDescription: Writable<string>
    relatedDomain: Writable<string>
    greyedOut: Writable<boolean>
    isDappDefinition: Writable<boolean>
  }>()

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
  import { infoboxEntry } from '@components/info-box/InfoBox.svelte'
  import { useContext } from '@utils'
  import Button from '@components/_base/button/Button.svelte'
  import { writable, type Writable } from 'svelte/store'
  import type { Account } from '@stores'
  import { query } from '@api/query'
  import { getOverview } from '@api/gateway'
  import type {
    EntityOverviewResponse,
    EntityOverviewResponseEntityItem
  } from '@radixdlt/babylon-gateway-api-sdk'
  import NameEntryKey from './entries/name/Key.svelte'
  import NameEntryValue from './entries/name/Value.svelte'
  import SelectAccountKey from './entries/select_account/Key.svelte'
  import SelectAccountValue from './entries/select_account/Value.svelte'
  import DescriptionKey from './entries/description/Key.svelte'
  import DescriptionValue from './entries/description/Value.svelte'
  import SetAsDappKey from './entries/set_as_dapp/Key.svelte'
  import SetAsDappValue from './entries/set_as_dapp/Value.svelte'
  import TitleInformationKey from './entries/title_information/Key.svelte'
  import TitleInformationValue from './entries/title_information/Value.svelte'
  import TitleLinkingMetadataKey from './entries/title_linking_metadata/Key.svelte'
  import TitleLinkingMetadataValue from './entries/title_linking_metadata/Value.svelte'
  import DomainKey from './entries/domain/Key.svelte'
  import DomainValue from './entries/domain/Value.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let accounts: Account[]

  const keyColumnWidth = '0.6fr'

  const transactionManifest = (
    address: string,
    metadata: { key: string; value: unknown }[]
  ) => {
    let manifest = ''
    for (const entry of metadata) {
      manifest += `
              SET_METADATA
                ComponentAddress("${address}")
                "${entry.key}"
                "${entry.value}";
              `
    }
    return manifest
  }

  const { send, response, loading } = query('sendTransaction')

  const hasDAppDefinitionMetadata = (
    entity: EntityOverviewResponseEntityItem
  ) =>
    !!entity.metadata.items.find(
      (item) => item.key === 'account_type' && item.value === 'dapp definition'
    )

  let formattedAccounts = writable<FormattedAccount[] | undefined>(undefined)

  let accountOverviews: EntityOverviewResponse

  $: getOverview(accounts.map((acc) => acc.address)).then(
    (overview) => (accountOverviews = overview)
  )

  $: if (accountOverviews)
    formattedAccounts.set(
      accountOverviews.entities.map((entity) => ({
        label: `${
          accounts.find((acc) => acc.address === entity.address)?.label
        }${hasDAppDefinitionMetadata(entity) ? ' - dApp definition' : ''}`,
        address: entity.address,
        dappDefinition: hasDAppDefinitionMetadata(entity),
        name: entity.metadata.items.find((item) => item.key === 'name')?.value,
        description: entity.metadata.items.find(
          (item) => item.key === 'description'
        )?.value,
        domain: entity.metadata.items.find((item) => item.key === 'domain')
          ?.value
      }))
    )

  const update = () => {
    if (selectedAccount)
      send(
        transactionManifest(selectedAccount.address, [
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

  let selectedAccount: FormattedAccount | undefined
  $: setAsDAppDefinition = false
  const dAppName = writable('')
  const dAppDescription = writable('')
  const domain = writable('')
  let greyedOut = writable(false)
  let isDappDefinition = writable(false)

  $: {
    if (selectedAccount) {
      dAppName.set(selectedAccount.name || '')
      dAppDescription.set(selectedAccount.description || '')
      domain.set(selectedAccount.domain || '')
    }
  }

  $: isDappDefinition.set(!!selectedAccount?.dappDefinition)
  $: greyedOut.set(!$isDappDefinition && !setAsDAppDefinition)

  context.set('selectedAccount', (acc) => (selectedAccount = acc))
  context.set('asDAppDefinition', (bool) => (setAsDAppDefinition = bool))
  context.set('dAppName', dAppName)
  context.set('dAppDescription', dAppDescription)
  context.set('relatedDomain', domain)
  context.set('greyedOut', greyedOut)
  context.set('isDappDefinition', isDappDefinition)

  $: top = [
    infoboxEntry(SelectAccountKey, SelectAccountValue, $formattedAccounts),
    infoboxEntry(SetAsDappKey, SetAsDappValue)
  ] as const

  const dAppInfo = [
    infoboxEntry(TitleInformationKey, TitleInformationValue),
    infoboxEntry(NameEntryKey, NameEntryValue),
    infoboxEntry(DescriptionKey, DescriptionValue)
  ] as const

  const relatedThings = [
    infoboxEntry(TitleLinkingMetadataKey, TitleLinkingMetadataValue),
    infoboxEntry(DomainKey, DomainValue)
  ] as const
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
  <InfoBox entries={top} {keyColumnWidth}>
    <svelte:component this={entry.key} let:entry data={entry.data} slot="key" />
    <svelte:component
      this={entry.value}
      let:entry
      data={entry.data}
      slot="value"
    />
  </InfoBox>
  <Box wrapper cx={{ disabled: true }}>
    <InfoBox entries={dAppInfo} {keyColumnWidth} cx={{ paddingTop: '$xl' }}>
      <svelte:component
        this={entry.key}
        let:entry
        data={entry.data}
        slot="key"
      />
      <svelte:component
        this={entry.value}
        let:entry
        data={entry.data}
        slot="value"
      />
    </InfoBox>
    <InfoBox
      entries={relatedThings}
      {keyColumnWidth}
      cx={{ paddingTop: '$xl' }}
    >
      <svelte:component
        this={entry.key}
        let:entry
        data={entry.data}
        slot="key"
      />
      <svelte:component
        this={entry.value}
        let:entry
        data={entry.data}
        slot="value"
      />
    </InfoBox>
    <Box justify="end">
      <Button on:click={update}>Update</Button>
    </Box>
  </Box>
</Box>
