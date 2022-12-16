<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import SendTokenForm from './SendTokenForm.svelte'
  import { useMachine } from '@xstate/svelte'
  import { stateMachine } from './send-tokens-state-machine'
  import { accounts } from '@stores'
  import { AlertToast } from '@components/_base/toast/Toasts'

  const { state, send } = useMachine(stateMachine)

  $: if ($accounts) {
    $accounts.length > 0 && send('LOAD', { address: $accounts[0].address })
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
  {#if $state.matches('idle')}
    <Text bold>Please connect your radix wallet to get started.</Text>
  {:else if $state.matches('final')}
    <SendTokenForm balance={$state.context.transformedOverview?.fungible} />
  {:else if $state.matches('error')}
    <Text inline size="large" mb="medium" bold
      >Error: {$state.context.error.message}</Text
    >
  {/if}
</Box>
