<script lang="ts">
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'
  import { mutate } from '@queries'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Success from './Success.svelte'
  import { getTxIdFromMessage } from '@utils'

  let transactionManifest = ''

  const { trigger, loading, data, error } = mutate('sendTransaction')

  $: if ($data?.transactionIntentHash) {
    AlertToast({
      title: 'Success!',
      text: `Transaction has been sent succesfully`,
      txId: $data.transactionIntentHash,
      type: 'success'
    })()
  }

  $: if ($error) {
    const txId = getTxIdFromMessage($error.message)
    AlertToast({
      type: 'error',
      title: $error.name,
      ...(txId
        ? {
            txId,
            text: 'The transaction did not happen'
          }
        : {
            text: `The transaction did not happen. ${$error.message}`
          })
    })()
  }
</script>

{#if $data?.transactionIntentHash}
  <Success txID={$data?.transactionIntentHash} />
{:else}
  <Box transparent>
    <Text size={'xxlarge'} bold>Send Raw Transaction</Text>
  </Box>
  <Box transparent>
    <Text
      >Enter raw transaction manifest text to send to your linked Radix Wallet.
      No method call to “lock_fee” is required – the wallet will add this
      automatically.</Text
    >
  </Box>
  <Box justify="center" transparent>
    <Textarea
      bind:value={transactionManifest}
      placeholder="Enter a raw transaction manifest"
      size="lg"
    />
  </Box>

  <Box justify="center" transparent>
    {#if $loading}
      <Button>
        <LoadingSpinner />
      </Button>
    {:else}
      <Button
        on:click={() =>
          trigger({
            transactionManifest
          })}>Submit</Button
      >
    {/if}
  </Box>
{/if}
