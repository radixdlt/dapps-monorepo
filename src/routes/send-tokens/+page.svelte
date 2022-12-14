<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import SendTokenForm from './SendTokenForm.svelte'
</script>

<Box transparent>
  <Text inline size="xxlarge" mb="medium" bold>Send Tokens</Text>
  <SendTokenForm />
</Box>
