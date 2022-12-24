<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { accounts, connected } from '@stores'
  import { shortenAddress } from '@utils'

  export let title: string

  $: accountsList = $accounts?.map((account) => ({
    address: account.address,
    label: `${account.label} (${shortenAddress(account.address)})`,
    unavailable: false
  }))
</script>

<Box>
  <Text inline size="xxlarge" mb="medium" bold>{title}</Text>
  {#if $connected}
    <slot accounts={accountsList} />
  {:else}
    <Text bold>Please connect your Radix Wallet to get started.</Text>
  {/if}
</Box>
