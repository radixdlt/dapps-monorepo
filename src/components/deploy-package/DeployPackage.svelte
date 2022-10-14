<script lang="ts">
  import UploadFileButton from '@components/upload-file-button/UploadFileButton.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import { byteArrayFromHex, hash, hexStringFromByteArray } from '@utils'
  import { Buffer } from 'buffer'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import {
    createTransactionService,
    type ExtractAbiResponse
  } from '../../utils/transaction-library'
  import { mutate } from '@queries'
  import type { GlobalEntityId } from '@radixdlt/alphanet-gateway-api-v0-sdk'

  // Temporary for testing alphanet
  let transaction = `
      CALL_METHOD
          ComponentAddress("system_tdx_a_1qsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs2ufe42")
          "lock_fee"
          Decimal("100");
    `

  let packageAddress: GlobalEntityId
  let parsedWASM: ExtractAbiResponse

  let transitionEnded = false

  const {
    loading: publishing,
    trigger: sendTransaction,
    data: sendTransactionData
  } = mutate('sendTransaction')
  const { trigger: postTransactionReceipt, data: transactionReceiptData } =
    mutate('transactionReceipt')

  const upload = async (file: File) => {
    parsedWASM = (await createTransactionService()).extract_abi({
      package_wasm: Buffer.from(await file.arrayBuffer()).toString('hex')
    })

    const codeHash: string = hexStringFromByteArray(
      hash(byteArrayFromHex(parsedWASM.code))
    )

    const abiHash: string = hexStringFromByteArray(
      hash(byteArrayFromHex(parsedWASM.abi))
    )
    transaction += `PUBLISH_PACKAGE Blob("${codeHash}") Blob("${abiHash}");\n`
  }

  const deploy = () => {
    sendTransaction({
      transactionManifest: transaction,
      blobs: [parsedWASM.abi, parsedWASM.code]
    })
  }

  $: if ($sendTransactionData) {
    postTransactionReceipt($sendTransactionData.transactionHash)
  }

  $: if ($transactionReceiptData) {
    packageAddress =
      $transactionReceiptData.committed.receipt.state_updates
        .new_global_entities[0]
  }
</script>

{#if !packageAddress}
  <Box
    outFly="right"
    on:out;roend={() => (transitionEnded = true)}
    transparent
    flex="col"
    items="center"
  >
    {#if !parsedWASM}
      <UploadFileButton
        name="Select compiled Scrypto package"
        filetypes={['.wasm']}
        onFileSelected={upload}
      >
        Upload WASM
      </UploadFileButton>
    {:else}
      <Button on:click={deploy}
        >{$publishing ? 'Publishing...' : 'Publish'}</Button
      >
      <Box mt="large" inFly="left" transparent>
        {transaction}
      </Box>
    {/if}
  </Box>
{/if}

{#if transitionEnded}
  <Box mt="large" inFly="left" transparent flex="col" items="center">
    <Box transparent><Text p="large" size="large">Success! 🎉</Text></Box>
    <Box transparent>
      <Text>Package Address</Text>
    </Box>
    {packageAddress}
  </Box>
{/if}
