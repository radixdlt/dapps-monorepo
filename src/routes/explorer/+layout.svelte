<script context="module">
  export const prerender = true
</script>

<script lang="ts">
  import { goto } from '$app/navigation'
  import Search from '@components/_base/search/Search.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import LoadingPage from '@components/loading-page/LoadingPage.svelte'

  let id: string

  const search = () => goto(`/explorer/transaction/${id}`)
</script>

<LoadingPage>
  <Box my="large" justify="center" transparent>
    <form style:width="30%" on:submit={search}>
      <Search bind:value={id} placeholder="Enter Transaction ID" />
    </form>
    <slot />
  </Box>
</LoadingPage>
