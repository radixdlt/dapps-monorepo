<script lang="ts">
  import type { AuthInfo } from '@api/utils/auth'

  import type { FungibleResource } from '@api/utils/entities/resource'
  import type { NonFungible } from '@api/utils/nfts'
  import RuleRow from './RuleRow.svelte'

  export let auth: AuthInfo
  export let tokenInfo: {
    fungibles: Promise<FungibleResource[]>
    nonFungibles: Promise<NonFungible[]>
  }
  export let hideRules: Set<string> = new Set()
</script>

<div class="card">
  <RuleRow accessRule={auth.owner} accessRuleName="Owner" />
  {#each Object.entries(auth.rules).filter((entry) => !hideRules.has(entry[0])) as entry}
    <RuleRow accessRule={entry[1].rule} accessRuleName={entry[0]} />
  {/each}
</div>
