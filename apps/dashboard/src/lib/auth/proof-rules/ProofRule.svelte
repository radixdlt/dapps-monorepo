<script lang="ts">
  import type { ProofRule, Requirement } from '@api/utils/auth'
  import Require from './Require.svelte'
  import AmountOf from './AmountOf.svelte'
  import AccessRuleCollection from '../AccessRuleCollection.svelte'
  import type { TokenInfo } from '../TokenInfo'

  export let proofRule: ProofRule
  export let tokenInfo: TokenInfo

  const accessRuleFromRequirement = (requirement: Requirement) =>
    ({
      type: 'ProofRule',
      proof_rule: {
        type: 'Require',
        requirement
      }
    } as const)
</script>

{#if proofRule.type === 'Require'}
  <Require requirement={proofRule.requirement} {tokenInfo} />
{/if}

{#if proofRule.type === 'AllOf'}
  <AccessRuleCollection
    type="All Of"
    accessRules={proofRule.list.map(accessRuleFromRequirement)}
    {tokenInfo}
  />
{/if}

{#if proofRule.type === 'AnyOf'}
  <AccessRuleCollection
    type="Any Of"
    accessRules={proofRule.list.map(accessRuleFromRequirement)}
    {tokenInfo}
  />
{/if}

{#if proofRule.type === 'CountOf'}
  <AccessRuleCollection
    accessRules={proofRule.list.map(accessRuleFromRequirement)}
    type={`At Least ${proofRule.count} Of`}
    {tokenInfo}
  />
{/if}

{#if proofRule.type === 'AmountOf'}
  <AmountOf rule={proofRule} {tokenInfo} />
{/if}
