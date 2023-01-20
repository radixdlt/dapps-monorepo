<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { useMachine } from '@xstate/svelte'
  import { stateMachine } from './navbar-page-state-machine'
  import { accounts } from '@stores'
  import { shortenAddress } from '@utils'

  export let title: string

  const { state, send } = useMachine(stateMachine)

  $: if ($accounts && $accounts.length > 0) {
    send('LOGGEDIN')
  }

  $: accountsList = $accounts?.map((account) => ({
    address: account.address,
    label: `${account.label} (${shortenAddress(account.address)})`,
    unavailable: false
  }))
</script>

<Box>
  <Text inline size="xxlarge" mb="medium" bold>{title}</Text>
  {#if $state.matches('not-logged-in')}
    <Text bold>Please connect your Radix Wallet to get started.</Text>
  {/if}
  {#if $state.matches('idle')}
    <slot accounts={accountsList} />
  {/if}
  {#if $state.matches('error')}
    <Text inline size="large" mb="medium" bold>
      Error: {$state.context.error.message}
    </Text>
  {/if}
</Box>
