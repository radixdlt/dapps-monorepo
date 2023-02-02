<script>
  import Text from '@components/_base/text/Text.svelte'
  import { context } from '../../DappMetadata.svelte'

  const greyedOut = context.get('greyedOut')
</script>

<Text bold muted={$greyedOut}>Linking Metadata</Text>
