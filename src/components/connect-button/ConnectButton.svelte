<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import Button from '@components/_base/button/Button.svelte'
  import { query } from '../../query-lib/'
  import Box from '@components/_base/box/Box.svelte'

  const { data, get, loading } = query('requestAddresses')

  $: if ($data) {
    accounts.set($data.accountAddresses)
    selectedAccount.set($data.accountAddresses[0])
  }
</script>

<Box transparent p="none">
  {#if $loading}
    <Button disabled size="small">Connecting...</Button>
  {:else if $data}
    <Button active disabled size="small">Connected</Button>
  {:else}
    <Button size="small" on:click={get}>Connect</Button>
  {/if}
</Box>
