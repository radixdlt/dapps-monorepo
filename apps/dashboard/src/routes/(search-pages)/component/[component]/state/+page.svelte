<script lang="ts">
  import type { PageData } from './$types'
  import State from '@dashboard-pages/search-pages/component/State.svelte'

  export let data: PageData
</script>

{#await data.state then state}
  <State {state} />
{/await}
