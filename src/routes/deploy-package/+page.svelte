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

  let transaction: string = `
    CALL_METHOD
	    ComponentAddress("system_tdx_a_1qsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs2ufe42")
	    "lock_fee"
	    Decimal("100");
  `

  let file: File

  let publishPackage: (file: File) => void

  const parseWASM = async (file: File) =>
    (await createTransactionService()).extract_abi({
      package_wasm: Buffer.from(await file.arrayBuffer()).toString('hex')
    })

  const addPublishToTransaction = async (
    transaction: string,
    extracted: ExtractAbiResponse
  ) => {
    const codeHash: string = hexStringFromByteArray(
      await hash(byteArrayFromHex(extracted.code))
    )
    const abiHash: string = hexStringFromByteArray(
      await hash(byteArrayFromHex(extracted.abi))
    )

    console.log('codehash', codeHash)
    return (
      transaction + `PUBLISH_PACKAGE Blob("${codeHash}") Blob("${abiHash}");\n`
    )
  }

  onMount(async () => {
    const { sendTransaction } = await import('@wallet')

    publishPackage = async (file: File) => {
      const extracted = await parseWASM(file)

      const result = await sendTransaction(
        await addPublishToTransaction(transaction, extracted),
        [extracted.abi, extracted.code]
      )

      if (result.isOk()) {
        console.log(result.value)
      } else {
        console.error(result.error)
      }
    }
  })
</script>

<UploadFileButton
  filetypes={['.wasm']}
  onFileSelected={(_file) => (file = _file)}>Upload WASM</UploadFileButton
>
<Button on:click={() => publishPackage(file)}>Publish</Button>
