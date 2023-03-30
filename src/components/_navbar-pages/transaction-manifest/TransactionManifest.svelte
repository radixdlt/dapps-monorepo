<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'
  import Dialog from '@components/_base/dialog/Dialog.svelte'
  import { goto } from '$app/navigation'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'

  let transactionManifest = ''

  let showDialog = false

  let confirm: () => void
  let waitForConfirm = new Promise((resolve: any) => (confirm = resolve))
</script>

<Dialog bind:open={showDialog} size="$6xl">
  <Box bgColor="surface" slot="description">
    <Text bold
      >This transaction manifest appears to include a "lock_fee" command. The
      Radix Wallet normally handles adding the required lock_fee from a user's
      account. Continue anyway?</Text
    >
    <Box justify="center" gap="medium">
      <Button size="small" on:click={() => (showDialog = false)}>Cancel</Button>
      <Button
        size="small"
        on:click={() => {
          showDialog = false
          confirm()
        }}>Continue</Button
      >
    </Box>
  </Box>
</Dialog>

<Box>
  <Text
    >Enter raw transaction manifest text to send to your linked Radix Wallet. No
    method call to “lock_fee” is required – the wallet will add this
    automatically.</Text
  >
</Box>
<Box justify="center">
  <Textarea
    fullWidth
    bind:value={transactionManifest}
    placeholder="Enter a raw transaction manifest"
    size="lg"
  />
</Box>

<Box justify="center">
  <SendTxButton
    onClick={async (send) => {
      if (transactionManifest.includes('lock_fee')) {
        showDialog = true
        waitForConfirm.then((_) => send(transactionManifest))
        waitForConfirm = new Promise((_) => {})
      } else {
        send(transactionManifest)
      }
    }}
    onResponse={(response) => {
      goto(
        `/transaction-manifest/success?txID=${response.transactionIntentHash}`
      )
    }}
  />
</Box>
