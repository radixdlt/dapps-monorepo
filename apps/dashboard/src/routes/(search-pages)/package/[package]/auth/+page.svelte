<script lang="ts">
  import AuthConfigurationTab from '$lib/auth/AuthConfigurationTab.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#await Promise.all([data.promises.package]) then [{ auth }]}
  <AuthConfigurationTab {auth} />
{/await}
