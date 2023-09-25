<script lang="ts">
  import { query } from '@api/query'
  import type { sendTransaction } from '@api/wallet'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'

  export let buttonProps: ComponentProps<ButtonNew>

  const dispatch = createEventDispatcher<{
    click: typeof send
    response: Awaited<ReturnType<typeof sendTransaction>>
  }>()

  let loading = false

  const { send, response } = query('sendTransaction')

  $: if ($response) {
    dispatch('response', $response)
    loading = false
  }
</script>

<ButtonNew
  {...buttonProps}
  on:click={() => {
    if (loading) return
    loading = true
    dispatch('click', send)
  }}
>
  {#if loading}
    <div style:height="60%" style:aspect-ratio="1/1">
      <LoadingSpinner />
    </div>
  {:else}
    <slot>Send</slot>
  {/if}
</ButtonNew>
