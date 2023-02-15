<script lang="ts">
  import Textarea from '@components/_base/textarea/Textarea.svelte'

  export let faded: boolean
  export let description: string
</script>

<Textarea
  disabled={faded}
  transparent={false}
  bind:value={description}
  size="sm"
  placeholder="A brief description for this dApp (maxiumum 128 characters)"
  maxlength={128}
/>
