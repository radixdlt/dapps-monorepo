<script lang="ts">
  import { goto } from '$app/navigation'
  import { query } from '@api/query'
  import Box from '@components/_base/box/Box.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Select from '@components/_base/select/Select.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { boxStyle } from './SendTokens.svelte'
  import type { TransformWithOverview } from './side-effects'

  export let resources: TransformWithOverview
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

  $: resourceList =
    resources &&
    resources.map(({ key, address, value }) => ({
      address,
      label: key,
      value
    }))

  let selectedResource: { address: string; label: string } | undefined

  $: amountAvailable =
    selectedResource?.address !== ''
      ? resources?.find((b) => b.address === selectedResource?.address)
          ?.value ||
        resources?.[0]?.value ||
        0
      : 0

  let amountToSend: number = 0

  $: hasEnoughTokens = Number(amountAvailable) >= amountToSend

  $: if (selectedResource)
    setResourceSelected(amountToSend > 0 && hasEnoughTokens)

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

<Box cx={boxStyle}>
  <Text bold align="right">Amount</Text>
  <Box
    bgColor="surface"
    wrapper
    flex="row"
    items="baseline"
    cx={{ width: '500px' }}
  >
    <Box bgColor="surface" cx={{ flexBasis: '60%' }} wrapper>
      <Input type="number" bind:value={amountToSend} placeholder="Amount" />
      {#if hasEnoughTokens}
        <Text inline size="small" color="grey">{amountAvailable}</Text>
        <Text inline size="xsmall" muted>(Available balance)</Text>
      {:else}
        <Text inline size="small">Not enough tokens in this account</Text>
      {/if}
    </Box>
    <Box
      bgColor="surface"
      px="small"
      cx={{ minWidth: '150px', flexBasis: '40%' }}
    >
      <Select
        bind:selected={selectedResource}
        options={resourceList}
        placeholderWhenEmpty="No tokens found"
      />
    </Box>
  </Box>
</Box>
