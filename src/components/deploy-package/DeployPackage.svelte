<script lang="ts">
  import UploadFileButton from '@components/upload-file-button/UploadFileButton.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import { byteArrayFromHex, hash, hexStringFromByteArray } from '@utils'
  import {
    createTransactionService,
    type ExtractAbiResponse
  } from './TransactionLibrary'
  import { onMount } from 'svelte'
  import { Buffer } from 'buffer'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { transactionReceipt } from '@gateway'

  // Temporary for testing alphanet
  let transaction = `
      CALL_METHOD
          ComponentAddress("system_tdx_a_1qsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs2ufe42")
          "lock_fee"
          Decimal("100");
    `

  let parsedWASM: ExtractAbiResponse

  let publishPackage: () => void

  let packageAddress: string

  let transitionEnded = false

  const upload = async (file: File) => {
    parsedWASM = (await createTransactionService()).extract_abi({
      package_wasm: Buffer.from(await file.arrayBuffer()).toString('hex')
    })

    const codeHash: string = hexStringFromByteArray(
      await hash(byteArrayFromHex(parsedWASM.code))
    )
    const abiHash: string = hexStringFromByteArray(
      await hash(byteArrayFromHex(parsedWASM.abi))
    )

    transaction += `PUBLISH_PACKAGE Blob("${codeHash}") Blob("${abiHash}");\n`
  }

  onMount(async () => {
    const { sendTransaction } = await import('@wallet')

    publishPackage = async () => {
      const result = await sendTransaction(transaction, [
        parsedWASM.abi,
        parsedWASM.code
      ])

      if (result.isErr()) {
        return // TODO handle error
      }

      packageAddress = await transactionReceipt(
        result.value.transactionHash
      ).then(
        (receipt) =>
          receipt.committed.receipt.state_updates.new_global_entities[0]
            .global_address
      )
    }
  })
</script>

{#if !packageAddress}
  <Box
    outFly="right"
    on:outroend={() => (transitionEnded = true)}
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
      <Button on:click={publishPackage}>Publish</Button>
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
