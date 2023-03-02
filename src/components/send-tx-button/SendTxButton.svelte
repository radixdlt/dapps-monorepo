<script lang="ts">
  import { query } from '@api/query'
  import type { sendTransaction } from '@api/wallet'
  import Button from '@components/_base/button/Button.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'

  export let disabled: boolean = false
  export let onClick: (sendFn: typeof send) => void
  export let onResponse: (
    response: Awaited<ReturnType<typeof sendTransaction>>
  ) => void = () => {}

  const { send, loading, response } = query('sendTransaction')

  $: if ($response) onResponse($response)
</script>

<Button {disabled} on:click={() => onClick(send)}>
  {#if $loading}
    <div style:height="60%" style:aspect-ratio="1/1">
      <LoadingSpinner />
    </div>
  {:else}
    <slot>Send</slot>
  {/if}
</Button>
