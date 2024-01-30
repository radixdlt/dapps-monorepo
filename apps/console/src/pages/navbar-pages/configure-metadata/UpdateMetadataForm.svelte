<script lang="ts">
  import { writable } from 'svelte/store'
  import { createEventDispatcher, onMount } from 'svelte'
  import { typedMetadataToString } from '@common/metadata'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import Form from '$lib/form/Form.svelte'
  import { callApi } from '@api/gateway'
  import Select from '$lib/select/Select.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import { transformMetadata, type ExpectedMetadata } from '@api/utils/metadata'
  import { err, ok } from 'neverthrow'
  import { dAppToolkit } from '@stores'
  import { createBadgeProof } from './side-effects'
  import type { FormItem } from '$lib/form/Form.svelte'
  import SendToWalletButton from '$lib/SendToWalletButton.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import TrashIcon from '@icons/trash.svg'
  import RestoreIcon from '@icons/replay_black_24dp.svg'
  import { track } from '../../../routes/+layout.svelte'

  export let entityAddress: string
  export let explicitMetadata: string[]
  export let defaultFormState = {}
  export let metaDataFormItems: FormItem[] = []
  export let accountsResources = writable<{ id: any; label: string }[]>([])
  export let expectedMetadataResponse: ExpectedMetadata
  export let initialFormStateTransformation: (
    extractedValues: Record<string, any>,
    expected: Record<string, any>
  ) => Record<string, any> = (extractedValues) => extractedValues

  const dispatchTxFinished = createEventDispatcher()

  const { walletApi } = $dAppToolkit!
  const getMetadata = (address: string) =>
    callApi('getEntityDetailsVaultAggregated', [address], {
      explicitMetadata
    })
      .map(([response]) => response.explicit_metadata)
      .andThen((metadata) =>
        metadata
          ? ok(transformMetadata({ metadata }, expectedMetadataResponse))
          : err('metadata not found in response')
      )

  const proofs = writable<
    {
      resource?: {
        account?: string
        address?: string
        ids?: string[]
        name?: string
      }
      nftId?: string
    }[]
  >([])
  const status = writable<'loading' | 'success' | 'error'>('loading')
  const formState = writable<Record<string, any>>(defaultFormState)
  const lockedState = writable<Record<string, boolean>>({})
  const transactionStatus = writable<'init' | 'loading'>('init')
  const initialFormState = writable<Record<string, any>>(defaultFormState)

  $: {
    if (initialFormState) {
      hasDataChanged.set(
        Object.entries($formState).some(
          ([key, value]) =>
            JSON.stringify(value) !== JSON.stringify($initialFormState[key])
        )
      )
    }
  }

  onMount(() => {
    getMetadata(entityAddress).map(({ expected }) => {
      const extractedValues = Object.entries(expected).reduce(
        (acc, [key, value]) => {
          const expectedMetadataKey = key
          lockedState.set({
            ...$lockedState,
            [expectedMetadataKey]: value.item.is_locked
          })
          return {
            ...acc,
            [expectedMetadataKey]: typedMetadataToString(value.typed)
          }
        },
        defaultFormState
      )
      const loadedData = initialFormStateTransformation(
        extractedValues,
        expected
      )

      initialFormState.set(loadedData)
      formState.set(JSON.parse(JSON.stringify($initialFormState)))
      status.set('success')
    })
  })

  const isFormDisabled = writable<boolean>(false)
  const hasDataChanged = writable<boolean>(false)

  const getTransactionManifest = (
    formValues: Record<string, any>,
    items: FormItem[]
  ) =>
    items
      .map((item) =>
        $lockedState[item.key] || !item?.transformValue
          ? undefined
          : item.transformValue(formValues[item.key])
      )
      .filter(Boolean)
      .join('')

  const handleSendTransaction = async () => {
    track('click:configure-metadata')
    $transactionStatus = 'loading'

    const transactionManifest = `
      ${createBadgeProof($proofs || [])} 
      ${getTransactionManifest($formState, metaDataFormItems)}
    `

    console.log(transactionManifest)
    await walletApi
      .sendTransaction({
        transactionManifest
      })
      .map(() => {
        dispatchTxFinished('entityUpdated')
      })

    $transactionStatus = 'init'
  }

  const getNfIds = (ids: string[]) => ids.map((id) => ({ id, label: id }))
</script>

{#if $status === 'loading'}
  <SkeletonLoader />
{:else if $status === 'success'}
  <div class="form">
    <Form
      disabled={$isFormDisabled}
      items={metaDataFormItems}
      state={formState}
      showPadLockWhenDisabled={true}
      disabledFields={$lockedState}
      initialState={initialFormState}
    />

    <Divider />

    <div class="badges-header">
      <h3>Badges</h3>

      <button
        class="add-button"
        on:click={() => {
          proofs.set([
            ...$proofs,
            {
              resource: {}
            }
          ])
        }}>+ Add Badge</button
      >
    </div>

    {#each $proofs as listItem, index}
      <div style:margin-bottom="1rem" class="with-action">
        <div class="badge-select">
          <Select
            placeholder="Select badge resource"
            items={[...$accountsResources]}
            on:select={({ detail: resource }) => {
              $proofs[index] = { resource, nftId: 'any' }
            }}
          />
          {#if $proofs[index].resource?.ids?.length}
            <Select
              placeholder="Select non-fungible"
              selected="any"
              items={[
                { id: 'any', label: 'Any' },
                ...getNfIds($proofs[index]?.resource?.ids || [])
              ]}
              on:select={({ detail: resourceAddress }) => {
                $proofs[index] = {
                  ...$proofs[index],
                  nftId: resourceAddress
                }
              }}
            />
          {/if}
        </div>

        <button
          on:click={() => {
            proofs.set([...$proofs.toSpliced(index, 1)])
          }}
        >
          <IconNew icon={TrashIcon} --size="1.3rem" faded /></button
        >
      </div>
    {/each}
  </div>
  <Divider />
  {#if $hasDataChanged}
    <div class="data-has-changed">
      You have made edits to the current on-network values. In order to commit
      your edits, click "Send to the Radix Wallet" to approve the needed
      transaction.
    </div>
    <button
      class="restore-button"
      on:click={() => {
        formState.set(JSON.parse(JSON.stringify($initialFormState)))
      }}
      >Reset All Edits <div class="icon-shift">
        <IconNew --size="1rem" icon={RestoreIcon} />
      </div></button
    >
  {/if}

  <SendToWalletButton
    disabled={!$hasDataChanged}
    loading={$transactionStatus === 'loading'}
    on:click={() => handleSendTransaction()}
  />
{:else if $status === 'error'}
  <div class="error-message">Something went wrong. Try again later.</div>
{/if}

<style lang="scss">
  .data-has-changed {
    margin-bottom: 1rem;
  }

  .restore-button {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    height: 2rem;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0 var(--spacing-2xl);
    border-radius: var(--border-radius-lg);
    color: var(--color-grey-1);
    background: var(--color-grey-3);
    font-weight: var(--font-weight-bold-1);
  }

  .icon-shift {
    transform: translateY(1px);
  }

  .badges-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .add-button {
    color: var(--theme-button-primary);
    font-weight: var(--font-weight-bold-1);
  }

  .badge-select {
    width: 100%;
  }

  .with-action {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-lg);
  }
</style>
