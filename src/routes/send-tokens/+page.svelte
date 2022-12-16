<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import SendTokenForm from './SendTokenForm.svelte'
  import { useMachine } from '@xstate/svelte'
  import { stateMachine } from './send-tokens-state-machine'
  import { accounts } from '@stores'
  import { AlertToast } from '@components/_base/toast/Toasts'

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
      text: $state.context.error.message,
      type: 'error'
    })()
  }
</script>

<Box transparent>
  <Text inline size="xxlarge" mb="medium" bold>Send Tokens</Text>
  {#if $state.matches('not-logged-in')}
    <Text bold>Please connect your radix wallet to get started.</Text>
  {:else if $state.matches('account-data-fetched') || $state.matches('idle')}
    <SendTokenForm
      onSend={(data) => send({ type: 'SENDTOKEN', data })}
      onSelectFromAccount={handleSelectFromAccount}
      balance={$state.context.transformedOverview?.fungible}
    />
  {:else if $state.matches('sending-token')}
    <Text bold>Confirm manifest in wallet</Text>
  {:else if $state.matches('final')}
    <Text mb="medium">Transaction sent!</Text>
    <Text pointer underlined on:click={() => send('RETRY')}
      >Send another one</Text
    >
  {:else if $state.matches('error')}
    <Text inline size="large" mb="medium" bold
      >Error: {$state.context.error.message}</Text
    >
  {/if}
</Box>
