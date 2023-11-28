<script lang="ts">
  import type { AccessRuleNode } from '@api/utils/auth'
  import ProofRule from './proof-rules/ProofRule.svelte'
  import AllOfAnyOf from './AccessRuleCollection.svelte'
  import type { FungibleResource } from '@api/utils/entities/resource'
  import type { NonFungible } from '@api/utils/nfts'

  export let rule: AccessRuleNode

  export let tokenInfo: {
    fungibles: Promise<FungibleResource[]>
    nonFungibles: Promise<NonFungible[]>
  }
</script>

{#if rule.type === 'AllOf'}
  <AllOfAnyOf type="All Of" accessRules={rule.access_rules} {tokenInfo} />
{:else if rule.type === 'AnyOf'}
  <AllOfAnyOf type="Any Of" accessRules={rule.access_rules} {tokenInfo} />
{:else if rule.type === 'ProofRule'}
  <ProofRule proofRule={rule.proof_rule} {tokenInfo} />
{/if}
