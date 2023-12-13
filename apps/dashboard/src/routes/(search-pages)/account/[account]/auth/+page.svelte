<script lang="ts">
  import AuthConfigurationTab from '../../../../../components/auth/AuthConfigurationTab.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#await Promise.all([data.promises.account]) then [{ auth }]}
  <AuthConfigurationTab {auth} />
{/await}
