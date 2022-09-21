<script lang="ts">
  import { goto } from '$app/navigation'
  import { navigating } from '$app/stores'
  import LoadingSpinner from '@components/_base/loading-spinner/LoadingSpinner.svelte'
  import { container } from './style'
  import Search from '@components/_base/search/Search.svelte'

  let id: string

  const search = () => goto(`/explorer/transaction/${id}`)
</script>

<div>
  <div class={container}>
    <form style:width="30%" on:submit={search}>
      <Search width="100%" bind:value={id} placeholder="Enter Transaction ID" />
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
