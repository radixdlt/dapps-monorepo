<script lang="ts">
  import AuthConfigurationTab from '../../../../../components/auth/AuthConfigurationTab.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#await Promise.all( [data.promises.component, data.promises.authResources] ) then [{ auth }, tokenInfo]}
  <AuthConfigurationTab {auth} />
{/await}
