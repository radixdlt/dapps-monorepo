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
  import Popover from '@components/_base/popover/Popover.svelte'
  import Image from '@components/_base/image/Image.svelte'
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'

  const { get, state } = query('requestAddresses', undefined, { manual: true })

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })()
  }

  $: if ($state.status === 'success') {
    accounts.set($state.data.accountAddresses)
    selectedAccount.set($state.data.accountAddresses[0])
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
    <Popover>
      <Button slot="button" connectButton size="small">
        <Icon
          height="xs"
          width="xs"
          type={icons['dashboard']}
          filter="brightness(0) invert(1)"
        /><Text mx="xsmall">Connect</Text>
      </Button>
      <Box
        cx={{ width: '$4xl', zIndex: 1000 }}
        flex="col"
        gap="medium"
        connectButtonPopover
        px="medium"
        slot="content"
      >
        <Box flex="row" p="none" gap="medium" transparent>
          <Image
            cx={{ borderRadius: '$md' }}
            src="/images/popover-radix-logo.png"
            width="$lg"
            alt="logo"
          />
          <Text bold>Connect your Radix Wallet</Text>
        </Box>
        <Button
          cx={{ borderRadius: '$sm', backgroundColor: '$connectButton' }}
          full
          on:click={get}
          size="small">Connect now</Button
        >
        <IconTextItem
          textColor="$connectButtonPopover"
          isIconColor
          noPadding
          icon="information">What is Radix Wallet?</IconTextItem
        >
      </Box>
    </Popover>
  {/if}
</Box>
