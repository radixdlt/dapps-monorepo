<script lang="ts">
  import { goto } from '$app/navigation'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { query } from '@api/query'
  import type { FungibleResource } from '@api/utils/resources'
  import Box from '@components/_base/box/Box.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Select from '@components/_base/select/Select.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import {
    ManifestBuilder,
    ManifestAstValue,
    InstructionList
  } from '@radixdlt/radix-engine-toolkit'
  import { boxStyle } from '../SendTokens.svelte'
  import { CURRENT_NETWORK } from '../../../../network'

  export let resources: Promise<FungibleResource[]>
  export let selectedFromAccount: string = ''
  export let selectedToAccount: string = ''
  export let setTransactionManifest: (manifest: string) => void
  export let setResourceSelected: (selected: boolean) => void

  const getSendTokenManifest = (
    resource: string,
    fromAccount: string,
    toAccount: string,
    amount: number
  ): Promise<string> => {
    if (!resource || !fromAccount || !toAccount || !amount) {
      return Promise.resolve('')
    }

    const manifest = new ManifestBuilder()
      .callMethod(fromAccount, 'withdraw', [
        new ManifestAstValue.Address(resource),
        new ManifestAstValue.Decimal(amount)
      ])
      .takeFromWorktopByAmount(resource, amount, (builder, bucket) =>
        builder.callMethod(toAccount, 'deposit', [bucket])
      )
      .build()

    return manifest
      .convert(InstructionList.Kind.String, CURRENT_NETWORK.id)
      .then((manifest: any) => manifest.instructions.value)
  }

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
    getSendTokenManifest(
      selectedResource.address,
      selectedFromAccount,
      selectedToAccount,
      amountToSend
    ).then(setTransactionManifest)

  $: if ($response)
    goto(`/send-tokens/success?txID=${$response.transactionIntentHash}`)
</script>

<Box cx={boxStyle}>
  <Text bold align="right">Amount</Text>
  <Box bgColor="surface" wrapper flex="row" cx={{ width: '500px' }}>
    <Box bgColor="surface" cx={{ flexBasis: '60%' }} wrapper>
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
    </Box>
    <Box
      bgColor="surface"
      px="small"
      py="none"
      cx={{ minWidth: '150px', flexBasis: '40%' }}
    >
      {#await resourceList}
        <Select loading={true} />
      {:then resourceList}
        <Select
          bind:selected={selectedResource}
          options={resourceList}
          placeholderWhenEmpty="No tokens found"
        />
      {/await}
    </Box>
  </Box>
</Box>
