<script lang="ts">
  import { context } from '../../DappMetadata.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'

  const description = context.get('dAppDescription')

  const greyedOut = context.get('greyedOut')
</script>

<Textarea
  disabled={$greyedOut}
  transparent={false}
  bind:value={$description}
  size="sm"
  placeholder="A brief description for this dApp (maxiumum 128 characters)"
  maxlength={128}
/>
