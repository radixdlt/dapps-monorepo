<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import Text from '../text/Text.svelte'
  import { shortenAddress } from '@utils'

  export let title: string
  export let text: string
  export let txId: string
  export let type: 'success' | 'error' | 'warning' | 'info' = 'info'

  const borderColors = {
    success: '$primary',
    error: 'red',
    warning: 'orange',
    info: '$onBackground'
  }
</script>

<Box
  cx={{
    borderLeft: 'solid !important',
    borderWidth: '$md !important',
    borderColor: `${borderColors[type]} !important`,
    minHeight: '40px !important'
  }}
>
  <Text bold>{title}</Text>
  <Text>{text}</Text>
  {#if txId}
    <Box mx="none" px="none">
      <Text inline bold>TxID:</Text>
      <IconTextItem
        on:click={() => navigator.clipboard.writeText(txId)}
        icon="copy"
        interactiveIcon
        iconPosition="right"
        iconSize="xs"
        noPadding
        noMargin
        textColor="$highlightedText">{shortenAddress(txId)}</IconTextItem
      >
    </Box>
  {/if}
</Box>
