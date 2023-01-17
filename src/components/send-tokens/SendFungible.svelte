<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Select from '@components/_base/select/Select.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { TransformWithOverview } from '@stateMachines/transformers'
  import type { Writable } from 'svelte/store'

  export let resources: TransformWithOverview
  export let hasEnoughTokens: Writable<boolean>
  export let selectedResourceAddress: Writable<string>
  export let amountToSend: Writable<number>

  $: resourceList =
    resources &&
    resources.map(({ key, address, value }) => ({
      address,
      label: key,
      value
    }))

  $: selectedResource = resourceList?.[0] || { address: '', label: '' }
  $: selectedResourceAddress.set(selectedResource.address)

  $: amountAvailable =
    selectedResource?.address !== ''
      ? resources?.find((b) => b.address === selectedResource?.address)
          ?.value ||
        resources?.[0]?.value ||
        0
      : 0

  let inputValue: number

  $: amountToSend.set(inputValue)

  $: hasEnoughTokens.set(Number(amountAvailable) > $amountToSend)
</script>

<Text bold align="right">Amount</Text>
<Box
  bgColor="surface"
  wrapper
  flex="row"
  items="baseline"
  cx={{ width: '500px' }}
>
  <Box bgColor="surface" cx={{ flexBasis: '60%' }} wrapper>
    <Input type="number" bind:value={inputValue} placeholder="Amount" />
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
      handleSelect={(resource) => (selectedResource = resource)}
      options={resourceList}
      placeholderWhenEmpty="No tokens found"
    />
  </Box>
</Box>
