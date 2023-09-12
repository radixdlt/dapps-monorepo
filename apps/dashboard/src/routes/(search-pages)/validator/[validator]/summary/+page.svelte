<script lang="ts">
  import { goto } from '$app/navigation'
  import Summary from '@dashboard-pages/search-pages/validator/Summary.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<Summary
  on:navigate-to-details={() => goto(`/network-staking/${data.address}`)}
/>
