<script lang="ts">
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { shortenAddress } from '@utils'

  export let title: string
  export let resourceAddress: string
</script>

<Text inline size="xxlarge" bold>{title}</Text>
<Box transparent m="none" p="none" inline>
  <IconTextItem
    on:click={() => navigator.clipboard.writeText(resourceAddress)}
    icon="copy"
    interactiveIcon
    iconPosition="right"
    iconSize="xs"
    noPadding
    textColor="$highlightedText">{shortenAddress(resourceAddress)}</IconTextItem
  >
</Box>
