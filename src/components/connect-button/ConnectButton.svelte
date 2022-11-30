<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import Button from '@components/_base/button/Button.svelte'
  import { query } from '@queries'
  import Box from '@components/_base/box/Box.svelte'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import ConnectPopover from './components/ConnectPopover.svelte'
  import AccountsPopover from './components/AccountsPopover.svelte'
  import type { Account } from '@io/wallet'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'

  const { get, state } = query('requestAddresses', undefined, { manual: true })

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })()
  }

  $: if ($state.status === 'success') {
    accounts.set($state.data.oneTimeAccounts)
    selectedAccount.set($state.data.oneTimeAccounts[0])
  }

  const handleSelect = (account: Account) => {
    selectedAccount.set(account)
  }
</script>

<Box transparent p="none">
  {#if $state.status === 'loading'}
    <Button connectButton size="small" on:click={get}>
      <LoadingSpinner />
    </Button>
  {:else if $state.status === 'success'}
    <AccountsPopover
      accounts={$accounts}
      onSelect={handleSelect}
      selected={$selectedAccount}
    />
  {:else}
    <ConnectPopover onConnect={get} />
  {/if}
</Box>
