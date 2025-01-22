<script lang="ts">
  import { writable } from 'svelte/store'
  import EntitySearchInput from './EntitySearchInput.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import type { Entity } from './EntitySearchInput.svelte'
  import UpdateMetadataForm from './UpdateMetadataForm.svelte'
  import {
    setStringMetaData,
    removeMetadata,
    setStringArrayMetaData,
    setUrlMetaData,
    setAddressArrayMetaData,
    setOriginArrayMetaData,
    setAddressMetaData
  } from '@common/metadata'
  import { z } from 'zod'
  import { MetadataType } from '../../../helpers/metadata'
  import MetadataForVerification from './MetadataForVerification.svelte'
  import MetadataForDisplay from './MetadataForDisplay.svelte'
  import ClaimedWebsiteStatus from './ClaimedWebsiteStatus.svelte'
  import ClaimedEntityStatus from './ClaimedEntityStatus.svelte'
  import {
    createStandardMetadata,
    getStringMetadata
  } from '@api/utils/metadata'
  import { transformAccount } from '@api/utils/entities/component/account'
  import { accounts } from '@stores'
  import { shortenAddress } from '@utils'
  import { callApi } from '@api/gateway'
  import type { FormItem } from '$lib/form/Form.svelte'
  export let query: string | undefined = undefined

  type AccountResource = { id: any; label: string }
  let entityDetails = writable<Entity | undefined>()
  let accountsResources = writable<AccountResource[]>([])

  $: {
    callApi(
      'getEntityDetailsVaultAggregated',
      $accounts.map(({ address }) => address),
      {
        explicitMetadata: ['name']
      }
    ).map((response) => {
      const accounts = response.map((entityDetails) =>
        transformAccount(entityDetails)
      )
      const resources = accounts
        .map((account) => {
          const fungibles = account.resources.fungible.map((resource) => {
            const name = getStringMetadata('name')({
              items: resource.explicitMetadata || []
            })

            return {
              id: {
                address: resource.address,
                account: account.address,
                ids: [],
                name
              },
              label: `${name || 'Unnamed resource'} (${shortenAddress(
                resource.address
              )})`
            }
          })

          const nonFungibles = account.resources.nonFungible
            .map((resource) => {
              if (!resource.ids.length) {
                return undefined
              }

              const name = getStringMetadata('name')({
                items: resource.explicitMetadata || []
              })
              return {
                id: {
                  address: resource.address,
                  account: account.address,
                  ids: resource.ids
                },
                label: `${name || 'Unnamed resource'} (${shortenAddress(
                  resource.address
                )})`
              }
            })
            .filter((x) => !!x)

          return [...fungibles, ...nonFungibles]
        })
        .flat()
      accountsResources.set(resources as AccountResource[])
      return resources
    })
  }

  const metadataForVerification: FormItem = {
    key: '',
    showCondition: () => true,
    formItemType: 'svelteComponent',
    component: MetadataForVerification
  }

  const metadataForDisplay: FormItem = {
    key: '',
    showCondition: () => true,
    formItemType: 'svelteComponent',
    component: MetadataForDisplay
  }

  const divider: FormItem = {
    key: '',
    showCondition: () => true,
    formItemType: 'svelteComponent',
    component: Divider
  }

  const dAppDefinitionsFormItem: FormItem = {
    key: 'dapp_definitions',
    label: 'dapp_definitions',
    placeholder: 'dApp definition account addresses',
    formItemType: 'list',
    metadata: {},
    startDecorator: ClaimedEntityStatus,
    startDecoratorPropertiesFn: () => ({
      entityAddress: $entityDetails?.address
    }),
    addLabel: '+ Add dApp definition',
    showCondition: (formState) =>
      formState.account_type === 'dapp definition' ||
      formState.dapp_definitions.length,
    transformValue: function (value: string[]) {
      const entityAddresses = value
        .map((value) => value.trim())
        .filter((value) => value)
      return entityAddresses.length
        ? setAddressArrayMetaData(
            $entityDetails?.address || '',
            this.key,
            entityAddresses
          )
        : removeMetadata($entityDetails?.address || '', this.key)
    }
  }

  const descriptionFormItem: FormItem = {
    key: 'description',
    label: 'description',
    placeholder: 'Enter description (truncated after 256 characters)',
    formItemType: 'textarea',
    rows: 3,
    metadata: { type: MetadataType.String },
    showCondition: (formState) =>
      formState.account_type === 'dapp definition' || formState.description,
    transformValue: function (value) {
      return value === ''
        ? removeMetadata($entityDetails?.address || '', this.key)
        : setStringMetaData($entityDetails?.address || '', this.key, value)
    }
  }

  const nameFormItem: FormItem = {
    key: 'name',
    label: 'name',
    placeholder: 'dApp name (truncated after 32 characters)',
    formItemType: 'input',
    metadata: { type: MetadataType.String },
    showCondition: (formState) =>
      formState.account_type === 'dapp definition' || formState.name,
    transformValue: function (value) {
      return value === ''
        ? removeMetadata($entityDetails?.address || '', this.key)
        : setStringMetaData($entityDetails?.address || '', this.key, value)
    }
  }

  const iconUrlFormItem: FormItem = {
    key: 'icon_url',
    label: 'icon_url',
    placeholder: 'Enter icon URL',
    formItemType: 'input',
    schema: z.string().startsWith('https://', {
      message: 'Must provide URL that starts with https://'
    }),
    metadata: { type: MetadataType.Url },
    showCondition: (formState) =>
      formState.account_type === 'dapp definition' || formState.icon_url,
    transformValue: function (value: string) {
      return value === ''
        ? removeMetadata($entityDetails?.address || '', this.key)
        : setUrlMetaData($entityDetails?.address || '', this.key, value)
    }
  }

  const tagsFormItem: FormItem = {
    key: 'tags',
    label: 'tags',
    placeholder:
      'Enter tags (truncated after 100 tags, to include multiple tags use commas to separate them)',
    formItemType: 'input',
    metadata: { type: MetadataType.StringArray },
    transformValue: function (value: string) {
      const tags = value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      return tags.length
        ? setStringArrayMetaData($entityDetails?.address || '', this.key, tags)
        : removeMetadata($entityDetails?.address || '', this.key)
    },
    showCondition: (formState) =>
      formState.account_type === 'dapp definition' || formState.tags
  }

  const accountMetadataFormItems: FormItem[] = [
    divider,
    {
      ...metadataForDisplay,
      showCondition: (formState) =>
        formState.account_type === 'dapp definition' ||
        formState.name ||
        formState.description ||
        formState.tags ||
        formState.icon_url
    },
    {
      key: 'account_type',
      label: 'account_type',
      placeholder: '',
      formItemType: 'select',
      items: [
        { id: 'dapp definition', label: 'dapp definition' },
        { id: 'false', label: '-- not set --' }
      ],
      transformValue: function (value) {
        return value === 'dapp definition'
          ? setStringMetaData($entityDetails?.address || '', this.key, value)
          : removeMetadata($entityDetails?.address || '', this.key)
      }
    },
    nameFormItem,
    descriptionFormItem,
    tagsFormItem,
    iconUrlFormItem,
    {
      ...divider,
      showCondition: (formState) =>
        formState.account_type === 'dapp definition' ||
        formState.claimed_entities.length ||
        formState.claimed_websites.length ||
        formState.dapp_definitions.length
    },
    {
      ...metadataForVerification,
      showCondition: (formState) =>
        formState.account_type === 'dapp definition' ||
        formState.claimed_entities.length ||
        formState.claimed_websites.length ||
        formState.dapp_definitions.length
    },
    {
      key: 'claimed_entities',
      label: 'claimed_entities',
      placeholder: 'Enter entity address',
      formItemType: 'list',
      metadata: {},
      startDecorator: ClaimedEntityStatus,
      startDecoratorPropertiesFn: () => ({
        entityAddress: $entityDetails?.address
      }),
      addLabel: '+ Add Claimed Entity',
      showCondition: (formState) =>
        formState.account_type === 'dapp definition' ||
        formState.claimed_entities.length,
      transformValue: function (value: string[]) {
        const entityAddresses = value
          .map((value) => value.trim())
          .filter((value) => value)
        return entityAddresses.length
          ? setAddressArrayMetaData(
              $entityDetails?.address || '',
              this.key,
              entityAddresses
            )
          : removeMetadata($entityDetails?.address || '', this.key)
      }
    },
    {
      key: 'account_locker',
      label: 'account_locker',
      placeholder: 'Enter locker address',
      formItemType: 'input',
      schema: z.string().startsWith('locker_', {
        message: 'Must start with locker_'
      }),
      metadata: { type: MetadataType.Address },
      showCondition: (formState) =>
        formState.account_type === 'dapp definition',
      transformValue: function (value) {
        return value
          ? setAddressMetaData($entityDetails?.address || '', this.key, value)
          : removeMetadata($entityDetails?.address || '', this.key)
      }
    },
    {
      key: 'claimed_websites',
      label: 'claimed_websites',
      placeholder: 'Enter page URL',
      formItemType: 'list',
      startDecorator: ClaimedWebsiteStatus,
      startDecoratorPropertiesFn: () => ({
        entityAddress: $entityDetails?.address
      }),
      metadata: {},
      addLabel: '+ Add Claimed Website',
      schema: z.string().regex(/^.*[^/]$/, {
        message: 'Must not end with /'
      }),
      showCondition: (formState: Record<string, any>) =>
        formState.account_type === 'dapp definition' ||
        formState.claimed_websites.length,
      transformValue: function (value: string[]) {
        const entityAddresses = value
          .map((value) => value.trim())
          .filter((value) => value)
        return entityAddresses.length
          ? setOriginArrayMetaData(
              $entityDetails?.address || '',
              this.key,
              entityAddresses
            )
          : removeMetadata($entityDetails?.address || '', this.key)
      }
    },
    dAppDefinitionsFormItem
  ]

  const fungibleResourceMetadataFormItems: FormItem[] = [
    divider,
    metadataForDisplay,
    {
      ...nameFormItem,
      placeholder: 'Simple name of the asset',
      showCondition: () => true
    },
    {
      key: 'symbol',
      label: 'symbol',
      placeholder:
        'A short unique identifier, often used on exchanges or to label an amount of the token',
      formItemType: 'input',
      metadata: { type: MetadataType.String },
      showCondition: () => true,
      transformValue: function (value) {
        return value === ''
          ? removeMetadata($entityDetails?.address || '', this.key)
          : setStringMetaData($entityDetails?.address || '', this.key, value)
      }
    },
    {
      ...descriptionFormItem,
      placeholder:
        'A short unique identifier, often used on exchanges or to label an amount of the token',
      showCondition: () => true
    },
    {
      ...tagsFormItem,
      placeholder: 'List of descriptive tags for the asset',
      showCondition: () => true
    },
    {
      ...iconUrlFormItem,
      placeholder: 'Location of image to be used to represent the token',
      showCondition: () => true
    },
    {
      key: 'info_url',
      label: 'info_url',
      placeholder: 'Direct link to an informational webpage',
      formItemType: 'input',
      schema: z.string().startsWith('https://', {
        message: 'Must provide URL that starts with https://'
      }),
      metadata: { type: MetadataType.Url },
      showCondition: () => true,
      transformValue: function (value: string) {
        return value === ''
          ? removeMetadata($entityDetails?.address || '', this.key)
          : setUrlMetaData($entityDetails?.address || '', this.key, value)
      }
    },
    divider,
    metadataForVerification,
    {
      ...dAppDefinitionsFormItem,
      showCondition: () => true
    }
  ]

  const nonFungibleResourceMetadataFormItems: FormItem[] = [
    ...fungibleResourceMetadataFormItems.filter((item) => item.key !== 'symbol')
  ]

  const componentMetadataFormItems: FormItem[] = [
    divider,
    metadataForDisplay,
    {
      ...nameFormItem,
      placeholder: 'Simple name of the component',
      showCondition: () => true
    },
    {
      ...descriptionFormItem,
      placeholder: 'Summarized description of the component and its usage',
      showCondition: () => true
    },
    {
      ...tagsFormItem,
      placeholder: 'List of descriptive tags',
      showCondition: () => true
    },
    divider,
    metadataForVerification,
    {
      key: 'dapp_definition',
      label: 'dapp_definition',
      placeholder: 'dApp definition account address',
      formItemType: 'input',
      startDecorator: ClaimedEntityStatus,
      startDecoratorPropertiesFn: () => ({
        entityAddress: $entityDetails?.address
      }),
      metadata: { type: MetadataType.Address },
      showCondition: () => true,
      transformValue: function (value) {
        return value === ''
          ? removeMetadata($entityDetails?.address || '', this.key)
          : setAddressMetaData($entityDetails?.address || '', this.key, value)
      }
    }
  ]

  const validatorMetadataFormItems: FormItem[] = [
    divider,
    metadataForDisplay,
    {
      ...nameFormItem,
      placeholder: 'Simple name',
      showCondition: () => true
    },
    {
      ...descriptionFormItem,
      placeholder: 'Summarized description of the validator and its usage',
      showCondition: () => true
    },
    {
      ...iconUrlFormItem,
      placeholder: 'Location of image to be used to represent the validator',
      showCondition: () => true
    },
    {
      key: 'info_url',
      label: 'info_url',
      placeholder: 'Direct link to an informational webpage',
      formItemType: 'input',
      schema: z.string().startsWith('https://', {
        message: 'Must provide URL that starts with https://'
      }),
      metadata: { type: MetadataType.Url },
      showCondition: () => true,
      transformValue: function (value: string) {
        return value === ''
          ? removeMetadata($entityDetails?.address || '', this.key)
          : setUrlMetaData($entityDetails?.address || '', this.key, value)
      }
    }
  ]
</script>

<div style:width="37rem" style:max-width="100%">
  <EntitySearchInput
    {query}
    onEntityDetails={(value) => ($entityDetails = value)}
  />

  {#if $entityDetails?.type === 'Account'}
    <UpdateMetadataForm
      on:entityUpdated={() => entityDetails.set(undefined)}
      {accountsResources}
      entityAddress={$entityDetails.address}
      explicitMetadata={[
        'account_type',
        'claimed_entities',
        'claimed_websites',
        'dapp_definitions',
        'account_locker',
        'name',
        'description',
        'tags',
        'icon_url'
      ]}
      expectedMetadataResponse={createStandardMetadata({
        account_type: 'String',
        claimed_entities: 'GlobalAddressArray',
        claimed_websites: 'OriginArray',
        dapp_definitions: 'GlobalAddressArray',
        account_locker: 'GlobalAddress',
        name: 'String',
        description: 'String',
        tags: 'StringArray',
        icon_url: 'Url'
      })}
      defaultFormState={{
        account_type: 'false',
        name: '',
        description: '',
        icon_url: '',
        account_locker: '',
        tags: '',
        claimed_entities: [],
        claimed_websites: [],
        dapp_definitions: []
      }}
      initialFormStateTransformation={(extractedValues, expected) => {
        return {
          ...extractedValues,
          claimed_entities: expected.claimed_entities?.typed.values || [],
          claimed_websites: expected.claimed_websites?.typed.values || [],
          account_locker: expected.account_locker?.typed.value || '',
          dapp_definitions: expected.dapp_definitions?.typed.values || [],
          account_type: expected.account_type?.typed.value
            ? 'dapp definition'
            : 'false'
        }
      }}
      metaDataFormItems={accountMetadataFormItems}
    />
  {/if}

  {#if $entityDetails?.type === 'FungibleResource'}
    <UpdateMetadataForm
      on:entityUpdated={() => entityDetails.set(undefined)}
      {accountsResources}
      entityAddress={$entityDetails.address}
      explicitMetadata={[
        'dapp_definitions',
        'name',
        'symbol',
        'description',
        'tags',
        'icon_url',
        'info_url'
      ]}
      expectedMetadataResponse={createStandardMetadata({
        dapp_definitions: 'GlobalAddressArray',
        name: 'String',
        symbol: 'String',
        description: 'String',
        tags: 'StringArray',
        icon_url: 'Url',
        info_url: 'Url'
      })}
      defaultFormState={{
        name: '',
        symbol: '',
        description: '',
        icon_url: '',
        info_url: '',
        tags: '',
        dapp_definitions: []
      }}
      initialFormStateTransformation={(extractedValues, expected) => {
        return {
          ...extractedValues,
          dapp_definitions: expected.dapp_definitions?.typed.values || []
        }
      }}
      metaDataFormItems={fungibleResourceMetadataFormItems}
    />
  {/if}

  {#if $entityDetails?.type === 'NonFungibleResource'}
    <UpdateMetadataForm
      on:entityUpdated={() => entityDetails.set(undefined)}
      {accountsResources}
      entityAddress={$entityDetails.address}
      explicitMetadata={[
        'dapp_definitions',
        'name',
        'description',
        'tags',
        'icon_url',
        'info_url'
      ]}
      expectedMetadataResponse={createStandardMetadata({
        dapp_definitions: 'GlobalAddressArray',
        name: 'String',
        description: 'String',
        tags: 'StringArray',
        icon_url: 'Url',
        info_url: 'Url'
      })}
      defaultFormState={{
        name: '',
        description: '',
        icon_url: '',
        info_url: '',
        tags: '',
        dapp_definitions: []
      }}
      initialFormStateTransformation={(extractedValues, expected) => {
        return {
          ...extractedValues,
          dapp_definitions: expected.dapp_definitions?.typed.values || []
        }
      }}
      metaDataFormItems={nonFungibleResourceMetadataFormItems}
    />
  {/if}

  {#if $entityDetails?.type === 'Component' || $entityDetails?.type === 'Package'}
    <UpdateMetadataForm
      on:entityUpdated={() => entityDetails.set(undefined)}
      {accountsResources}
      entityAddress={$entityDetails.address}
      explicitMetadata={['dapp_definition', 'name', 'description', 'tags']}
      expectedMetadataResponse={createStandardMetadata({
        dapp_definition: 'GlobalAddress',
        name: 'String',
        description: 'String',
        tags: 'StringArray'
      })}
      defaultFormState={{
        name: '',
        description: '',
        tags: '',
        dapp_definition: ''
      }}
      metaDataFormItems={componentMetadataFormItems}
    />
  {/if}

  {#if $entityDetails?.type === 'Validator'}
    <UpdateMetadataForm
      on:entityUpdated={() => entityDetails.set(undefined)}
      {accountsResources}
      entityAddress={$entityDetails.address}
      explicitMetadata={['name', 'description', 'icon_url', 'info_url']}
      expectedMetadataResponse={createStandardMetadata({
        name: 'String',
        description: 'String',
        icon_url: 'Url',
        info_url: 'Url'
      })}
      defaultFormState={{
        name: '',
        description: '',
        icon_url: '',
        info_url: ''
      }}
      metaDataFormItems={validatorMetadataFormItems}
    />
  {/if}
</div>
