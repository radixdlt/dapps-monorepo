<script lang="ts">
  import type { AccessRuleNode, AuthInfo, Requirement } from '@api/utils/auth'
  import RuleRow from './RuleRow.svelte'
  import { resourcesCacheClient } from '@api/utils/resource-cache-client'
  import { writable } from 'svelte/store'

  import type { AccessRule, ProofRule } from '@api/utils/auth'
  import { ResultAsync } from 'neverthrow'
  import { groupBy } from 'ramda'
  import type { TokenInfo } from './TokenInfo'

  export let auth: AuthInfo
  export let hideRules: Set<string> = new Set()

  const uniqueFungibles = new Set<string>()
  const uniqueGlobalIds = new Set<`${string}:${string}`>()
  const uniqueNonFungibles = new Set<string>()

  const analyseAccessRuleNode = (node: AccessRuleNode) => {
    if (node.type === 'ProofRule') {
      analyseProofRule(node.proof_rule)
    } else if (node.type === 'AllOf' || node.type === 'AnyOf') {
      node.access_rules.forEach((entry) => analyseAccessRuleNode(entry))
    }
  }

  const analyseRequirement = (requirement: Requirement) => {
    if (requirement.type === 'Resource') {
      uniqueFungibles.add(requirement.resource)
    } else if (requirement.type === 'NonFungible') {
      uniqueNonFungibles.add(requirement.non_fungible.resource_address)
      uniqueGlobalIds.add(
        `${requirement.non_fungible.resource_address}:${requirement.non_fungible.local_id.simple_rep}`
      )
    }
  }

  const analyseProofRule = (rule: ProofRule) => {
    if (
      rule.type === 'AllOf' ||
      rule.type === 'AnyOf' ||
      rule.type === 'CountOf'
    ) {
      rule.list.forEach((requirement) => {
        analyseRequirement(requirement)
      })
    } else if (rule.type === 'AmountOf') {
      uniqueFungibles.add(rule.resource)
    } else if (rule.type === 'Require') {
      analyseRequirement(rule.requirement)
    }
  }

  const analyseAccessRule = (rule: AccessRule) => {
    if (rule.type === 'Protected') {
      analyseAccessRuleNode(rule.access_rule)
    }
  }

  /**
   *  Iterate over rules and capture all unique fungibles, non-fungibles and global NFT ids
   */
  analyseAccessRule(auth.owner)
  Object.values(auth.rules).forEach((entry) => analyseAccessRule(entry.rule))

  const tokenInfo = writable<TokenInfo>()

  ResultAsync.combine([
    resourcesCacheClient.queryFungibles(Array.from(uniqueFungibles)),
    resourcesCacheClient.queryNonFungibles(Array.from(uniqueNonFungibles)),
    ResultAsync.fromSafePromise(
      resourcesCacheClient.queryNonFungiblesData(Array.from(uniqueGlobalIds))
    )
  ]).map(() => {
    tokenInfo.set({
      fungibles: resourcesCacheClient.fungibleResources,
      nonFungibles: resourcesCacheClient.nonFungibleResourcesData,
      nonFungibleResources: resourcesCacheClient.nonFungibleResources
    })
  })

  $: modules = groupBy((entry) => entry[1].module, Object.entries(auth.rules))
</script>

<div class="card">
  <h3>Administrative Roles</h3>
  <RuleRow
    accessRule={auth.owner}
    accessRuleName="Owner"
    tokenInfo={$tokenInfo}
  />
</div>

{#each Object.entries(modules) as [module, rules]}
  <div class="card">
    <h3>{module} Roles</h3>
    {#each Object.entries(rules).filter((entry) => !hideRules.has(entry[0])) as [_, entry]}
      <RuleRow
        accessRule={entry[1].rule}
        accessRuleName={entry[0]}
        tokenInfo={$tokenInfo}
      />
    {/each}
  </div>
{/each}

<style lang="scss">
  .card {
    h3 {
      margin-bottom: var(--spacing-md);
    }
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
</style>
