<script lang="ts">
  import Box from '@svelte-ui/components/_base/box/Box.svelte'
  import Text from '@svelte-ui/components/_base/text/Text.svelte'
  import { accounts, connected } from '@svelte-ui/stores'
  import { accountLabel } from '@common/utils/formatting'

  export let title: string

  $: accountsList = $accounts?.map((account) => ({
    ...account,
    label: accountLabel(account)
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
