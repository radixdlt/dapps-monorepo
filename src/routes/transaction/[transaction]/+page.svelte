<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { query } from '@queries'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { shortenAddress } from '@utils'
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'

  const { state } = query('getTransactionDetails', $page.params.transaction)

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })()
  }
</script>

<Box transparent m="none" px="none" full>
  <Text inline size="xxlarge" bold>Transaction</Text>
  <Box transparent m="none" p="none" inline>
    <IconTextItem
      on:click={() => navigator.clipboard.writeText($page.params.transaction)}
      icon="copy"
      interactiveIcon
      iconPosition="right"
      iconSize="xs"
      noPadding
      textColor="$highlightedText"
      >{shortenAddress($page.params.transaction)}</IconTextItem
    >
  </Box>
</Box>

<Box full>
  {#if $state.status === 'loading'}
    <InfoBox
      data={{
        Status: undefined,
        Date: undefined,
        Fee: undefined
      }}
      loading
    />
  {:else}
    <InfoBox
      data={{
        Status: $state.data?.status,
        Date: $state.data?.date,
        Fee: $state.data?.fee
      }}
      loading={false}
    />
  {/if}
</Box>
