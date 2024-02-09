<script lang="ts">
  import type { AccessRuleNode, AuthInfo, Requirement } from '@api/utils/auth'
  import RuleRow from './RuleRow.svelte'
  import { resourcesCacheClient } from '@api/utils/resource-cache-client'
  import { writable } from 'svelte/store'
  import type { FungibleResource } from '@api/_deprecated/utils/entities/resource'
  import type { NonFungible } from '@api/utils/nfts'
  import type { AccessRule, ProofRule } from '@api/utils/auth'
  import { ResultAsync } from 'neverthrow'

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

  analyseAccessRule(auth.owner)
  Object.values(auth.rules).forEach((entry) => analyseAccessRule(entry.rule))

  const tokenInfo = writable<{
    fungibles: Map<string, FungibleResource>
    nonFungibles: Map<`${string}:${string}`, NonFungible>
  }>()

  ResultAsync.combine([
    resourcesCacheClient.queryFungibles(Array.from(uniqueFungibles)),
    resourcesCacheClient.queryNonFungibles(Array.from(uniqueNonFungibles)),
    ResultAsync.fromSafePromise(
      resourcesCacheClient.queryNonFungiblesData(Array.from(uniqueGlobalIds))
    )
  ]).map(() => {
    tokenInfo.set({
      fungibles: resourcesCacheClient.fungibleResources,
      nonFungibles: resourcesCacheClient.nonFungibleResourcesData
    })
  })
</script>

<div class="card">
  <RuleRow
    accessRule={auth.owner}
    accessRuleName="Owner"
    tokenInfo={$tokenInfo}
  />
  {#each Object.entries(auth.rules).filter((entry) => !hideRules.has(entry[0])) as entry}
    <RuleRow
      accessRule={entry[1].rule}
      accessRuleName={entry[0]}
      tokenInfo={$tokenInfo}
    />
  {/each}
</div>
