<script lang="ts">
  import type { Requirement } from '@api/_deprecated/utils/auth'
  import ResourceProofRule from './ResourceProofRule.svelte'

  export let requirement: Requirement
  export let iconUrl: Promise<string | undefined> | undefined
  export let name: Promise<string | undefined> | undefined

  $: resourceAddress =
    requirement.type === 'Resource'
      ? requirement.resource
      : requirement.non_fungible.resource_address

  $: nftId =
    requirement.type === 'Resource'
      ? undefined
      : requirement.non_fungible.local_id.simple_rep
</script>

<ResourceProofRule {resourceAddress} {nftId} {iconUrl} {name} />
