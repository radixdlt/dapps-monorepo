<script lang="ts">
  import { goto } from '$app/navigation'
  import SkeletonLoader from '@svelte-ui/components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { query } from '@common/api/query'
  import Input from '$lib/input/Input.svelte'
  import Select from '$lib/select/Select.svelte'
  import Text from '@svelte-ui/components/_base/text/Text.svelte'
  import { getSendTokenManifest } from '../manifests'
  import Label from '$lib/Label.svelte'
  import { formatTokenValue, shortenAddress } from '@common/utils/formatting'
  import type { FungibleResource } from '@common/api/_deprecated/utils/entities/resource'

  export let resources: Promise<FungibleResource[]>
  export let selectedFromAccount: string = ''
  export let selectedToAccount: string = ''
  export let setTransactionManifest: (manifest: string) => void
  export let setResourceSelected: (selected: boolean) => void

  const { response } = query('sendTransaction')

  $: resourceList = resources.then((r) =>
    r.map(
      ({
        metadata: {
          standard: { name }
        },
        address,
        value
      }) => ({
        address,
        label: name,
        value
      })
    )
  )

  let selectedResource: string

  $: amountAvailable = !!selectedResource
    ? resources.then(
        (r) => r.find((b) => b.address === selectedResource)?.value
      ) ||
      resources.then((r) => r[0]?.value) ||
      0
    : Promise.resolve(0)

  let amountToSend = ''

  $: hasEnoughTokens = amountAvailable.then(
    (amount) => Number(amount) >= Number(amountToSend)
  )

  $: if (selectedResource)
    hasEnoughTokens.then((hasEnoughTokens) =>
      setResourceSelected(Number(amountToSend) > 0 && hasEnoughTokens)
    )

  $: if (selectedResource)
    setTransactionManifest(
      getSendTokenManifest(
        selectedResource,
        selectedFromAccount,
        selectedToAccount,
        Number(amountToSend)
      )
    )

  $: if ($response)
    goto(
      `/send-tokens/success?txID=${$response.transactionIntentHash}&txStatus=${$response.status}`
    )
</script>

<div class="form-item">
  <Label>Resource</Label>
  {#await resourceList}
    <Select loading={true} />
  {:then resourceList}
    <Select
      bind:selected={selectedResource}
      items={resourceList.map((resource) => {
        return {
          label: `${resource.label?.value || ''} (${shortenAddress(
            resource.address
          )})`,
          id: resource.address
        }
      })}
      placeholder="Select a resource"
    />
  {/await}
</div>

<div class="form-item">
  <Label disabled={!selectedResource}>Amount</Label>
  <Input
    bind:value={amountToSend}
    placeholder="Amount"
    disabled={!selectedResource}
  />
  {#if selectedResource}
    {#await Promise.all([amountAvailable, hasEnoughTokens])}
      <SkeletonLoader />
    {:then [amountAvailable, hasEnoughTokens]}
      <Text size="xsmall" muted align="right">
        {#if hasEnoughTokens}{formatTokenValue(amountAvailable || 0)
            .displayValue} (available balance)
        {:else}Not enough tokens in this account{/if}<button
          class="max"
          on:click={() => {
            amountToSend = String(amountAvailable)
          }}>MAX</button
        ></Text
      >
    {/await}
  {/if}
</div>

<style lang="scss">
  .form-item {
    margin-bottom: var(--spacing-2xl);
  }

  .max {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
