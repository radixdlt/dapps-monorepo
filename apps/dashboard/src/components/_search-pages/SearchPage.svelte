<script lang="ts">
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let title: string
  export let address: string
</script>

<Box>
  <Text inline size="xxlarge" bold>{title}</Text>
  <Box m="none" p="none" inline>
    <IconTextItem
      on:click={() => navigator.clipboard.writeText(address)}
      icon="copy"
      interactiveIcon
      iconPosition="right"
      iconSize="xs"
      noPadding
      textColor="$highlightedText">{address}</IconTextItem
    >
  </Box>
</Box>

<slot />
