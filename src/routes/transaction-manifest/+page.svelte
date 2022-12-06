<script lang="ts">
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'
  import { mutate } from '@queries'

  let transactionManifest = ''

  const { trigger, loading } = mutate('sendTransaction')
</script>

<Box justify="center" transparent>
  <Textarea
    bind:value={transactionManifest}
    placeholder="Enter raw transaction manifest"
    size="lg"
  />
</Box>

<Box justify="center" transparent>
  {#if $loading}
    <Button>
      <LoadingSpinner />
    </Button>
  {:else}
    <Button
      on:click={() =>
        trigger({
          transactionManifest
        })}>Submit</Button
    >
  {/if}
</Box>
