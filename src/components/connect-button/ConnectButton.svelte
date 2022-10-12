<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import Button from '@components/_base/button/Button.svelte'
  import { query } from '../../query-lib/'
  import Box from '@components/_base/box/Box.svelte'

  const { data, get, loading } = query('requestAddresses')

  if ($data) {
    accounts.set($data?.accountAddresses)
    selectedAccount.set($data.accountAddresses?.[0])
  }
</script>

<Box transparent p="none">
  {#if $loading}
    <p>loading...</p>
  {:else}
    <Button size="small" on:click={get}>Connect</Button>
  {/if}
</Box>
