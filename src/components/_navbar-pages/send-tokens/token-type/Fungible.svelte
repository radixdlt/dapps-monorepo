<script lang="ts">
  import { goto } from '$app/navigation'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { query } from '@api/query'
  import type { Resources } from '@api/utils/resources'
  import Input from '@components/_base/input/Input.svelte'
  import Select from '@components/_base/select/Select.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let resources: Promise<Resources['fungible']>
  export let selectedFromAccount: string = ''
  export let selectedToAccount: string = ''
  export let setTransactionManifest: (manifest: string) => void
  export let setResourceSelected: (selected: boolean) => void

  const getSendTokenManifest = (
    resource: string,
    fromAccount: string,
    toAccount: string,
    amount: number
  ) =>
    `
      CALL_METHOD 
        ComponentAddress("${fromAccount}") 
        "withdraw_by_amount"
        Decimal("${amount}")             
        ResourceAddress("${resource}");
    
      CALL_METHOD
        ComponentAddress("${toAccount}") 
        "deposit_batch"
        Expression("ENTIRE_WORKTOP");
    `

  const { response } = query('sendTransaction')

  $: resourceList = resources.then((r) =>
    r.map(({ label, address, value }) => ({
      address,
      label,
      value
    }))
  )

  let selectedResource: { address: string; label: string } | undefined

  $: amountAvailable =
    selectedResource?.address !== ''
      ? resources.then(
          (r) => r.find((b) => b.address === selectedResource?.address)?.value
        ) ||
        resources.then((r) => r[0]?.value) ||
        0
      : Promise.resolve(0)

  let amountToSend: number = 0

  $: hasEnoughTokens = amountAvailable.then(
    (amount) => Number(amount) >= amountToSend
  )

  $: if (selectedResource)
    hasEnoughTokens.then((hasEnoughTokens) =>
      setResourceSelected(amountToSend > 0 && hasEnoughTokens)
    )

  $: if (selectedResource)
    setTransactionManifest(
      getSendTokenManifest(
        selectedResource.address,
        selectedFromAccount,
        selectedToAccount,
        amountToSend
      )
    )

  $: if ($response)
    goto(`/send-tokens/success?txID=${$response.transactionIntentHash}`)
</script>

<div class="title">
  <Text bold align="right">Amount</Text>
</div>
<div class="amount">
  <div class="input">
    <Input type="number" bind:value={amountToSend} placeholder="Amount" />
    {#await Promise.all([amountAvailable, hasEnoughTokens])}
      <SkeletonLoader />
    {:then [amountAvailable, hasEnoughTokens]}
      {#if hasEnoughTokens}
        <Text inline size="small" color="grey">{amountAvailable}</Text>
        <Text inline size="xsmall" muted>(Available balance)</Text>
      {:else}
        <Text inline size="small">Not enough tokens in this account</Text>
      {/if}
    {/await}
  </div>
  <div class="token-picker">
    {#await resourceList}
      <Select loading={true} />
    {:then resourceList}
      <Select
        bind:selected={selectedResource}
        options={resourceList}
        placeholderWhenEmpty="No tokens found"
      />
    {/await}
  </div>
</div>

<style>
  .title {
    grid-area: amount-title;
  }

  .amount {
    grid-area: amount;
    display: flex;
    flex-direction: row;
    gap: var(--spacing-lg);
  }

  .input {
    width: 300px;
  }

  .token-picker {
    padding: 0 var(--spacing-sm);
    width: 200px;
  }
</style>
