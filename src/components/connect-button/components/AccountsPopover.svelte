<script lang="ts">
  import Popover from '@components/_base/popover/Popover.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import { icons } from '../../../icon-assets'
  import { shortenAddress } from '@utils'
  import type { Account } from '@io/wallet'

  export let onSelect: (account: Account) => void
  export let accounts: Account[] = []
  export let selected: Account | undefined = undefined
  export let forceShow = false
</script>

<Popover {forceShow}>
  <Button slot="button" connectButton connected size="small">
    <Icon
      height="xs"
      width="xs"
      type={icons['dashboard']}
      filter="brightness(0) invert(1)"
    /><Text mx="xsmall">Connected</Text>
  </Button>
  <Box
    cx={{ width: '$4xl', zIndex: 1000 }}
    flex="col"
    gap="xsmall"
    connectButtonPopover
    px="medium"
    slot="content"
  >
    <Text mb="small" bold>Your Accounts:</Text>
    {#each accounts as account}
      <Button
        full
        on:click={() => onSelect(account)}
        size="small"
        selectedAccountButton={account.address === selected?.address}
        accountButton
      >
        <Text bold>{account.label}</Text><Text slightlyMuted
          >{shortenAddress(account.address)}</Text
        ></Button
      >
    {/each}
    <Text cx={{ alignSelf: 'center' }} mt="small" color="connect"
      >Disconnect Wallet</Text
    >
  </Box>
</Popover>
