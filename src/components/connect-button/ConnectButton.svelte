<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import Button from '@components/_base/button/Button.svelte'
  import { query } from '@queries'
  import Box from '@components/_base/box/Box.svelte'
  import { AlertToast } from '@components/_base/toast/Toasts'

  const { get, state } = query('requestAddresses', undefined, { manual: true })

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })
  }

  $: if ($state.status === 'success') {
    accounts.set($state.data.accountAddresses)
    selectedAccount.set($state.data.accountAddresses[0])
  }
</script>

<Box transparent p="none">
  {#if $state.status === 'loading'}
    <Button connectButton disabled size="small">Connecting...</Button>
  {:else if $state.status === 'success'}
    <Button connectButton active disabled size="small">Connected</Button>
  {:else}
    <Button connectButton size="small" on:click={get}>Connect</Button>
  {/if}
</Box>
