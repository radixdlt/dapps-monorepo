<script lang="ts">
  import AuthConfigurationTab from '$lib/auth/AuthConfigurationTab.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#await Promise.all([data.resource]) then [{ auth }]}
  <AuthConfigurationTab
    {auth}
    hideRules={new Set([
      'royalty_setter',
      'royalty_setter_updater',
      'royalty_locker',
      'royalty_locker_updater',
      'royalty_claimer',
      'royalty_claimer_updater'
    ])}
  />
{/await}
