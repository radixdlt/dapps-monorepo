<script lang="ts">
  import type {
    AmountOfProofRule,
    ProofRule,
    RequireProofRule,
    Requirement
  } from '@api/utils/auth'
  import Require from './Require.svelte'
  import AmountOf from './AmountOf.svelte'
  import AccessRuleCollection from '../AccessRuleCollection.svelte'
  import type { FungibleResource } from '@api/_deprecated/utils/entities/resource'
  import type { NonFungible } from '@api/utils/nfts'
  import type { GeneralNft } from '@api/_deprecated/utils/nfts/general-nft'

  export let proofRule: ProofRule
  export let tokenInfo: {
    fungibles: Map<string, FungibleResource>
    nonFungibles: Map<`${string}:${string}`, NonFungible>
  }

  const accessRuleFromRequirement = (requirement: Requirement) =>
    ({
      type: 'ProofRule',
      proof_rule: {
        type: 'Require',
        requirement
      }
    } as const)

  const getTokenInfo = (proofRule: AmountOfProofRule | RequireProofRule) => {
    if (proofRule.type === 'Require') {
      if (proofRule.requirement.type === 'Resource') {
        const resource = proofRule.requirement.resource
        const token = tokenInfo.fungibles.get(resource)

        return {
          name: token?.metadata.standard.name?.value,
          iconUrl: token?.metadata.standard.icon_url?.value?.href
        }
      } else {
        const resource = proofRule.requirement.non_fungible.resource_address
        const id = proofRule.requirement.non_fungible.local_id.simple_rep

        const token = tokenInfo.nonFungibles.get(`${resource}:${id}`)

        return {
          name: token?.nftData.expected.name?.value,
          iconUrl: (token?.nftData.expected as any).key_image_url?.value
        }
      }
    }

    if (proofRule.type === 'AmountOf') {
      const token = tokenInfo.fungibles.get(proofRule.resource)

      return {
        name: token?.metadata.standard.name?.value,
        iconUrl: token?.metadata.standard.icon_url?.value?.href
      }
    }

    return null
  }
</script>

{#if proofRule.type === 'Require'}
  {@const token = getTokenInfo(proofRule)}
  <Require
    requirement={proofRule.requirement}
    iconUrl={token?.iconUrl}
    name={token?.name}
  />
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
    type={`${proofRule.count} Out Of`}
    {tokenInfo}
  />
{/if}

{#if proofRule.type === 'AmountOf'}
  {@const token = getTokenInfo(proofRule)}
  <AmountOf rule={proofRule} iconUrl={token?.iconUrl} name={token?.name} />
{/if}
