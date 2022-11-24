<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import Button from '@components/_base/button/Button.svelte'
  import { query } from '@queries'
  import Box from '@components/_base/box/Box.svelte'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Icon from '@components/_base/icon/Icon.svelte'
  import { icons } from '../../icon-assets'
  import Text from '@components/_base/text/Text.svelte'
  import LoadingSpinner from './LoadingSpinner.svelte'

  const { get, state } = query('requestAddresses', undefined, { manual: true })

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })()
  }

  $: if ($state.status === 'success') {
    accounts.set($state.data.oneTimeAccountAddresses)
    selectedAccount.set($state.data.oneTimeAccountAddresses[0])
  }
</script>

<Box transparent p="none">
  {#if $state.status === 'loading'}
    <Button connectButton size="small" on:click={get}>
      <LoadingSpinner />
    </Button>
  {:else if $state.status === 'success'}
    <Button connectButton connected size="small" on:click={get}>
      <Icon
        height="xs"
        width="xs"
        type={icons['dashboard']}
        filter="brightness(0) invert(1)"
      /><Text mx="xsmall">Connected</Text>
    </Button>
  {:else}
    <Button connectButton size="small" on:click={get}>
      <Icon
        height="xs"
        width="xs"
        type={icons['dashboard']}
        filter="brightness(0) invert(1)"
      /><Text mx="xsmall">Connect</Text>
    </Button>
  {/if}
</Box>
