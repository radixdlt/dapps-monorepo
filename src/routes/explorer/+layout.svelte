<script lang="ts">
  import { goto } from '$app/navigation'
  import { navigating } from '$app/stores'
  import Input from '@components/_base/input/Input.svelte'
  import LoadingSpinner from '@components/_base/loading-spinner/LoadingSpinner.svelte'
  import { container } from './style'

  let id: string

  const search = () => goto(`/explorer/transaction/${id}`)
</script>

<div>
  <div class={container}>
    <form style:width="30%" on:submit={search}>
      <Input
        width="100%"
        bind:value={id}
        borderRadius="$lg"
        placeholder="Enter Transaction ID"
        icon="/images/search_icon.svg"
      />
    </form>
  </div>
  {#if $navigating}
    {#await new Promise((resolve) => setTimeout(resolve, 200)) then}
      <center>
        <LoadingSpinner />
      </center>
    {/await}
  {:else}
    <slot />
  {/if}
</div>
