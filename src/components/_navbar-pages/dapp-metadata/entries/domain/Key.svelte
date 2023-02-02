<script lang="ts">
  import Text from '@components/_base/text/Text.svelte'
  import { context } from '../../DappMetadata.svelte'

  const greyedOut = context.get('greyedOut')
</script>

<Text cx={{ paddingTop: '6px' }} bold muted={$greyedOut}>Domain</Text>
