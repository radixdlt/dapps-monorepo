<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let receipt: any
</script>

<Box cx={{ width: '100vh' }}>
  <pre>
    <Text>{JSON.stringify(receipt, null, 4)}</Text>
  </pre>
</Box>
