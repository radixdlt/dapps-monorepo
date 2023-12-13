<script lang="ts">
  import type { AuthInfo } from '@api/_deprecated/utils/auth'
  import RuleRow from './RuleRow.svelte'

  export let auth: AuthInfo
  export let hideRules: Set<string> = new Set()
</script>

<div class="card">
  <RuleRow accessRule={auth.owner} accessRuleName="Owner" />
  {#each Object.entries(auth.rules).filter((entry) => !hideRules.has(entry[0])) as entry}
    <RuleRow accessRule={entry[1].rule} accessRuleName={entry[0]} />
  {/each}
</div>
