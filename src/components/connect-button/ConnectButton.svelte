<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import Button from '@components/_base/button/Button.svelte'
  import { query } from '@queries'
  import Box from '@components/_base/box/Box.svelte'

  const { get, state } = query('requestAddresses')

  $: if ($state.status === 'success') {
    accounts.set($state.data.accountAddresses)
    selectedAccount.set($state.data.accountAddresses[0])
  }
</script>

<Box transparent p="none">
  {#if $state.status === 'loading'}
    <Button disabled size="small">Connecting...</Button>
  {:else if $state.status === 'success'}
    <Button active disabled size="small">Connected</Button>
  {:else}
    <Button size="small" on:click={get}>Connect</Button>
  {/if}
</Box>
