<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import SendTokenForm from './SendTokenForm.svelte'
  import { useMachine } from '@xstate/svelte'
  import { stateMachine } from './send-tokens-state-machine'
  import { accounts } from '@stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Success from './Success.svelte'
  import { getTxIdFromMessage } from '@utils'

  const { state, send } = useMachine(stateMachine)

  $: selectedAccount = $accounts && $accounts.length > 0 && $accounts[0].address

  const handleSelectFromAccount = (account: string) => {
    selectedAccount = account
  }

  $: if ($accounts && $accounts.length > 0) {
    send('LOGGEDIN')
  }

  $: if (selectedAccount) {
    send('LOAD', { address: selectedAccount })
  }

  $: if ($state.matches('error')) {
    AlertToast({
      title: 'Send tokens',
      text: 'The transaction did not happen',
      txId: getTxIdFromMessage($state.context.error.message),
      type: 'error'
    })()
  }

  $: isSendingToken = $state.matches('sending-token')
</script>

<Box transparent>
  <Text inline size="xxlarge" mb="medium" bold>Send Tokens</Text>
  {#if $state.matches('not-logged-in') && !$state.matches('final')}
    <Text bold>Please connect your Radix Wallet to get started.</Text>
  {/if}
  {#if $state.matches('idle') || isSendingToken}
    <SendTokenForm
      onSend={(data) => send({ type: 'SENDTOKEN', data })}
      onSelectFromAccount={handleSelectFromAccount}
      balance={$state.context.transformedOverview?.fungible}
      pending={isSendingToken}
    />
  {/if}
  {#if $state.matches('final')}
    <Success txID={$state.context.txID} />
  {/if}
  {#if $state.matches('error')}
    <Text inline size="large" mb="medium" bold>
      Error: {$state.context.error.message}
    </Text>
  {/if}
</Box>
