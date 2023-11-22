<script lang="ts">
  import { z } from '@common/zod'
  import { derived, writable, type Writable } from 'svelte/store'
  import Button from '@components/_base/button/ButtonNew.svelte'
  import Form, { type FormItem } from '../../../components/Form.svelte'
  import OwnerRole from '../../../components/OwnerRole.svelte'
  import type {
    OwnerAccessRuleUpdatable,
    AccessRule
  } from '../../../helpers/simple-access-rule-builder'
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'
  import type { Account as AccountType } from '@stores'
  import { createFungibleTokenManifest } from '../../../helpers/create-fungible-token-manifest'
  import { dAppToolkit } from '@stores'
  import {
    MetadataType,
    stringArrayMetadata,
    stringMetadata
  } from '../../../helpers/metadata'
  import Nft, { type NftData } from './Nft.svelte'
  import { createNonFungibleTokenManifest } from '../../../helpers/create-non-fungible-token-manifest'
  import { goto } from '$app/navigation'
  import { getTransactionDetails } from '@api/gateway'

  let selectedAccount = writable<AccountType>()

  let nftIds = writable<string[]>([])
  let nftState = writable<Record<string, { data: NftData; isValid: boolean }>>(
    {}
  )

  let status = writable<'initial' | 'sendingToWallet'>('initial')

  const handleNftDataChange = (
    key: string,
    value: { data: NftData; isValid: boolean }
  ) => {
    $nftState[key] = value
  }

  const addNft = () => {
    const id = crypto.randomUUID()
    $nftIds = [...$nftIds, id]
    $nftState[id] = {
      data: { name: '', description: '', key_image_url: '' },
      isValid: false
    }
  }

  const removeNft = (key: string) => {
    $nftIds = $nftIds.filter((id) => id !== key)
    const { [key]: _, ...rest } = $nftState
    $nftState = rest
  }

  let formState = writable<Record<string, string>>({
    ownerRoleUpdatable: 'Updatable',
    resourceType: 'fungible',
    trackSupply: 'true',
    initialSupply: '1000000',
    divisibility: '0',
    minter: 'owner',
    minter_updater: 'owner',
    burner: 'denyAll',
    burner_updater: 'denyAll',
    freezer: 'denyAll',
    freezer_updater: 'denyAll',
    recaller: 'denyAll',
    recaller_updater: 'denyAll',
    withdrawer: 'allowAll',
    withdrawer_updater: 'denyAll',
    depositer: 'allowAll',
    depositer_updater: 'denyAll',
    metadata_setter: 'owner',
    metadata_setter_updater: 'owner',
    metadata_locker: 'owner',
    metadata_locker_updater: 'owner',
    nft_data_setter: 'owner',
    nft_data_setter_updater: 'denyAll'
  })

  let metadataState = writable<Record<string, string>>({})

  let accessRule = writable<AccessRule | undefined>()

  let isFormDisabled = derived(
    status,
    ($status) => $status === 'sendingToWallet'
  )

  const fungibleOnlyConditionFn = (formState: Record<string, string>) =>
    formState.resourceType === 'fungible'

  const nonFungibleOnlyConditionFn = (formState: Record<string, string>) =>
    formState.resourceType === 'nonFungible'

  let isSendToWalletButtonDisabled = derived(
    [selectedAccount, accessRule, nftState, formState, isFormDisabled],
    ([
      $selectedAccount,
      $accessRule,
      $nftState,
      $formState,
      $isFormDisabled
    ]) => {
      if ($formState.resourceType === 'fungible')
        return !$selectedAccount || !$accessRule || $isFormDisabled

      const nftItems = Object.values($nftState)
      const hasNftItems = nftItems.length > 0
      const isNftItemsInvalid = nftItems.some((valid) => !valid.isValid)

      return (
        !$selectedAccount ||
        !$accessRule ||
        isNftItemsInvalid ||
        !hasNftItems ||
        $isFormDisabled
      )
    }
  )

  const resourceTypeItems: FormItem[] = [
    {
      key: 'resourceType',
      label: 'Token type',
      placeholder: 'Select token type',
      formItemType: 'select',
      items: [
        { id: 'fungible', label: 'Fungible token' },
        { id: 'nonFungible', label: 'Non-fungible token' }
      ]
    }
  ]

  const metaDataFormItems: FormItem[] = [
    {
      key: 'name',
      label: 'Name',
      placeholder: 'Token name (truncated after 32 characters)',
      formItemType: 'inputWithCheckbox',
      checkboxKey: 'nameLocked',
      checkboxLabel: 'Lock',
      metadata: { type: MetadataType.String }
    },
    {
      key: 'symbol',
      label: 'Symbol',
      placeholder: 'Enter symbol (truncated after 5 characters)',
      showCondition: fungibleOnlyConditionFn,
      formItemType: 'inputWithCheckbox',
      checkboxKey: 'symbolLocked',
      checkboxLabel: 'Lock',
      metadata: { type: MetadataType.String }
    },
    {
      key: 'icon_url',
      label: 'Icon URL',
      placeholder: 'Enter secure icon URL (https)',
      formItemType: 'inputWithCheckbox',
      checkboxKey: 'iconUrlLocked',
      checkboxLabel: 'Lock',
      schema: z
        .string()
        .startsWith('https://', { message: 'Must provide secure URL' }),
      metadata: { type: MetadataType.Url }
    },
    {
      key: 'description',
      label: 'Description',
      placeholder: 'Enter description (truncated after 256 characters)',
      formItemType: 'textareaWithCheckbox',
      rows: 3,
      checkboxKey: 'descriptionLocked',
      checkboxLabel: 'Lock',
      metadata: { type: MetadataType.String }
    },
    {
      key: 'tags',
      label: 'Tags (comma separated)',
      placeholder: 'Enter tags (truncated after 100 tags)',
      formItemType: 'inputWithCheckbox',
      checkboxKey: 'tagsLocked',
      checkboxLabel: 'Lock',
      metadata: { type: MetadataType.StringArray },
      transformValue: (value: string) =>
        value
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag)
    },
    {
      key: 'info_url',
      label: 'Info URL',
      placeholder: 'Enter secure info URL (https)',
      formItemType: 'inputWithCheckbox',
      checkboxKey: 'iconUrlLocked',
      checkboxLabel: 'Lock',
      schema: z
        .string()
        .startsWith('https://', { message: 'Must provide secure URL' }),
      metadata: { type: MetadataType.Url }
    }
  ]

  const fungibleTokenConfigItems: FormItem[] = [
    {
      key: 'trackSupply',
      label: 'Track supply',
      placeholder: 'Whether the engine should track supply',
      formItemType: 'select',
      items: [
        { id: 'true', label: 'Yes' },
        { id: 'false', label: 'No' }
      ],
      schema: z.string()
    },
    {
      key: 'initialSupply',
      label: 'Initial supply',
      placeholder: 'Enter initial supply',
      formItemType: 'input',
      showCondition: fungibleOnlyConditionFn,
      schema: z.string().refine(
        (value) => {
          const parsed = parseInt(value)
          return !isNaN(parsed) && parsed > 0
        },
        { message: 'Must be a positive integer value' }
      )
    },
    {
      key: 'divisibility',
      label: 'Token divisibility (between 0-18)',
      placeholder: 'Enter divisibility',
      formItemType: 'input',
      showCondition: fungibleOnlyConditionFn,
      schema: z.string().refine(
        (value) => {
          const parsed = parseInt(value)
          if (!isNaN(parsed) && parsed >= 0) {
            return parsed >= 0 && parsed <= 18
          }
        },
        { message: 'Must be a positive integer value between 0 and 18' }
      )
    }
  ]

  const authRuleSelectItems = [
    { id: 'owner', label: 'Owner' },
    { id: 'denyAll', label: 'Deny all' },
    { id: 'allowAll', label: 'Allow all' }
  ]

  const authRolesItems: FormItem[] = [
    {
      key: 'minter',
      label: 'minter',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'minter_updater',
      label: 'minter_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'withdrawer',
      label: 'withdrawer',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'withdrawer_updater',
      label: 'withdrawer_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'depositer',
      label: 'depositer',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'depositer_updater',
      label: 'depositer_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'burner',
      label: 'burner',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'burner_updater',
      label: 'burner_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'freezer',
      label: 'freezer',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'freezer_updater',
      label: 'freezer_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'recaller',
      label: 'recaller',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'recaller_updater',
      label: 'recaller_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'metadata_setter',
      label: 'metadata_setter',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'metadata_setter_updater',
      label: 'metadata_setter_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'metadata_locker',
      label: 'metadata_locker',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'metadata_locker_updater',
      label: 'metadata_locker_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems
    },
    {
      key: 'nft_data_setter',
      label: 'nft_data_setter',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems,
      showCondition: nonFungibleOnlyConditionFn
    },
    {
      key: 'nft_data_setter_updater',
      label: 'nft_data_setter_updater',
      placeholder: 'Select auth rule',
      formItemType: 'select',
      items: authRuleSelectItems,
      showCondition: nonFungibleOnlyConditionFn
    }
  ]

  const metadataFormValuesToManifestSyntax = () => {
    const formValues = $metadataState
    return metaDataFormItems
      .filter((item) => item.key in formValues && formValues[item.key])
      .map((item) => {
        switch (item.formItemType) {
          case 'inputWithCheckbox':
          case 'textareaWithCheckbox': {
            const value = formValues[item.key]

            const isLocked = formValues[item.checkboxKey] === 'true'

            if (item.key === 'tags') {
              const tags: string[] = item.transformValue!(value)
              return stringArrayMetadata(item.key, tags, isLocked)
            }

            return stringMetadata(
              item.key,
              value,
              isLocked,
              item.metadata?.type ?? MetadataType.String
            )
          }

          default:
            return
        }
      })
      .filter((item): item is string => !!item)
      .join(',')
  }

  const authRoleFormValuesToManifestSyntax = () => {
    const {
      resourceType,
      minter,
      minter_updater,
      burner,
      burner_updater,
      freezer,
      freezer_updater,
      recaller,
      recaller_updater,
      withdrawer,
      withdrawer_updater,
      depositer,
      depositer_updater,
      metadata_setter,
      metadata_setter_updater,
      metadata_locker,
      metadata_locker_updater,
      nft_data_setter,
      nft_data_setter_updater
    } = $formState

    const stringToAccessRule = (value: string) => {
      switch (value) {
        case 'owner':
          return 'Enum<OwnerRole::None>()'
        case 'allowAll':
          return 'Enum<AccessRule::AllowAll>()'
        case 'denyAll':
          return 'Enum<AccessRule::DenyAll>()'
        default:
          throw new Error('Invalid auth role value')
      }
    }

    const stringToMetadataAccessRule = (value: string) => {
      switch (value) {
        case 'owner':
          return 'None'
        case 'allowAll':
          return 'Some(Enum<AccessRule::AllowAll>())'
        case 'denyAll':
          return 'Some(Enum<AccessRule::DenyAll>())'
        default:
          throw new Error('Invalid auth role value')
      }
    }

    const createAccessRule = (
      setterValue: string,
      setterUpdaterValue: string
    ) => `
        Some(         
          Tuple(
              Some(${stringToAccessRule(setterValue)}),  
              Some(${stringToAccessRule(setterUpdaterValue)}),
          )
        )`

    const authRoles = (
      resourceType === 'fungible'
        ? [
            [minter, minter_updater],
            [burner, burner_updater],
            [freezer, freezer_updater],
            [recaller, recaller_updater],
            [withdrawer, withdrawer_updater],
            [depositer, depositer_updater]
          ]
        : [
            [minter, minter_updater],
            [burner, burner_updater],
            [freezer, freezer_updater],
            [recaller, recaller_updater],
            [withdrawer, withdrawer_updater],
            [depositer, depositer_updater],
            [nft_data_setter, nft_data_setter_updater]
          ]
    )
      .map(([setterValue, setterUpdaterValue]) =>
        createAccessRule(setterValue, setterUpdaterValue)
      )
      .join(',')

    const metadataAuthRoles = `
      "metadata_setter" => ${stringToMetadataAccessRule(metadata_setter)},
      "metadata_setter_updater" => ${stringToMetadataAccessRule(
        metadata_setter_updater
      )},
      "metadata_locker" => ${stringToMetadataAccessRule(
        metadata_locker
      )},          
      "metadata_locker_updater" => ${stringToMetadataAccessRule(
        metadata_locker_updater
      )}
    `

    return { authRoles, metadataAuthRoles }
  }

  const nftValuesToManifestSyntax = () => {
    const items = Object.values($nftState)
      .map(({ data }) => {
        const { name, description, key_image_url } = data
        return { name, description, key_image_url }
      })
      .map(
        (
          { name, description, key_image_url },
          index
        ) => `NonFungibleLocalId("#${index}#") => Tuple(
            Tuple(
              "${name}",
              "${description}",
              "${key_image_url}"
            )
          )`
      )
      .join(',')

    return items
  }

  const handleSendToWallet = () => {
    if ($accessRule) {
      const {
        trackSupply,
        divisibility,
        initialSupply,
        resourceType,
        ownerRoleUpdatable
      } = $formState

      const ownerAccessRuleUpdatable =
        ownerRoleUpdatable as unknown as OwnerAccessRuleUpdatable

      const shouldTrackSupply = trackSupply === 'true'

      const metadata = metadataFormValuesToManifestSyntax()

      const { authRoles, metadataAuthRoles } =
        authRoleFormValuesToManifestSyntax()

      const transactionManifest =
        resourceType === 'fungible'
          ? createFungibleTokenManifest({
              ownerAccessRule: $accessRule,
              ownerAccessRuleUpdatable,
              accountAddress: $selectedAccount.address,
              trackSupply: shouldTrackSupply,
              divisibility,
              initialSupply,
              metadata,
              authRoles,
              metadataAuthRoles
            })
          : createNonFungibleTokenManifest({
              ownerAccessRule: $accessRule,
              ownerAccessRuleUpdatable,
              accountAddress: $selectedAccount.address,
              trackSupply: shouldTrackSupply,
              metadata,
              authRoles,
              metadataAuthRoles,
              nfts: nftValuesToManifestSyntax()
            })

      $status = 'sendingToWallet'
      $dAppToolkit?.walletApi
        .sendTransaction({
          transactionManifest
        })
        .map(({ transactionIntentHash, status }) =>
          getTransactionDetails(transactionIntentHash).then((response) => {
            goto(
              `create-token/success?` +
                `txID=${transactionIntentHash}&` +
                `txStatus=${status}&` +
                `resourceAddress=${response.createdEntities[0].entity_address}`
            )
          })
        )

        .mapErr(() => {
          $status = 'initial'
        })
    }
  }
</script>

<div class="description">
  Create a fungible or non-fungible resource and deploy it to the Radix network.
</div>

<div class="content" id="create-token-page">
  <div class="left">
    <h3>Deposit to account</h3>
    <div class="account-picker" class:disabled={$isFormDisabled}>
      <AccountPicker bind:selected={$selectedAccount} />
    </div>

    <h3>Owner</h3>
    <OwnerRole bind:accessRule disabled={$isFormDisabled} />
    <Form
      disabled={$isFormDisabled}
      items={[
        {
          key: 'ownerRoleUpdatable',
          label: 'Owner role updatable',
          placeholder: 'Should the owner role be updatable?',
          formItemType: 'select',
          items: [
            { id: 'None', label: 'None' },
            { id: 'Updatable', label: 'Updatable' },
            { id: 'Fixed', label: 'Fixed' }
          ],
          schema: z.string()
        }
      ]}
      state={formState}
    />

    <h3>Token type</h3>
    <Form
      items={resourceTypeItems}
      state={formState}
      disabled={$isFormDisabled}
    />
    <Form
      items={fungibleTokenConfigItems}
      state={formState}
      disabled={$isFormDisabled}
    />

    <h3>Metadata</h3>
    <Form
      items={metaDataFormItems}
      state={metadataState}
      disabled={$isFormDisabled}
    />
  </div>

  <div class="right">
    <h3>Auth roles</h3>
    <Form items={authRolesItems} state={formState} disabled={$isFormDisabled} />
  </div>
</div>

{#if $formState.resourceType === 'nonFungible'}
  <h3>NFTs</h3>
  <div class="nft-builder">
    {#each $nftIds as nftId, index}
      <div class="nft">
        <div class="nft-content">
          <div class="nft-header">
            NFT #{index + 1}
            <button
              class="remove"
              on:click={() => {
                removeNft(nftId)
              }}>Remove</button
            >
          </div>
          <Nft
            on:change={(ev) => handleNftDataChange(nftId, ev.detail)}
            disabled={$isFormDisabled}
          />
        </div>
      </div>
    {/each}
    <div class="nft">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="add-item"
        on:click={() => {
          addNft()
        }}
      >
        <button class="add-item-button" disabled={$isFormDisabled}
          >Add item</button
        >
      </div>
    </div>
  </div>
{/if}
<Button
  size="big"
  disabled={$isSendToWalletButtonDisabled}
  on:click={() => handleSendToWallet()}
>
  {#if $status === 'sendingToWallet'}
    Sending to wallet...
  {:else}
    Send to wallet
  {/if}</Button
>

<style lang="scss">
  .description {
    margin-bottom: 3rem;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex-direction: column;
    gap: 2rem;
  }

  h3,
  .form-item,
  .account-picker,
  .content {
    margin-bottom: 1rem;
  }

  .nft-builder {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .nft-header {
    font-weight: bold;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eaeaea;
  }

  .nft-content {
    background: white;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .remove {
    font-size: 0.8rem;
  }

  .add-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 1rem);
    border: 0.3rem dashed var(--theme-border);
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    &:hover {
      border: 0.3rem dashed var(--theme-border-separator);
      cursor: pointer;
      .add-item-button {
        color: var(--theme-text-primary);
      }
    }
  }
  .add-item-button {
    font-size: 1rem;
    color: var(--theme-subtext);
  }
  .nft {
    min-height: 24.3rem;
  }
</style>
