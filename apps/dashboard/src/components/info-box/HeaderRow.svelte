<script lang="ts">
  import Row from '@components/info-box/Row.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let header: string
  export let faded: boolean = false
</script>

<Row>
  <div slot="left" />
  <Box slot="right" cx={{ padding: '30px 0 0 0' }}>
    <Text bold bind:muted={faded}>{header}</Text>
  </Box>
</Row>
