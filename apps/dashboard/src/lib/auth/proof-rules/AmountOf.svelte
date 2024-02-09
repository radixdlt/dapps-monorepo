<script lang="ts">
  import type { AmountOfProofRule } from '@api/utils/auth'
  import ResourceProofRule from './ResourceProofRule.svelte'

  export let rule: AmountOfProofRule
  export let iconUrl: string | undefined
  export let name: string | undefined
</script>

<ResourceProofRule
  amount={rule.amount}
  resourceAddress={rule.resource}
  {iconUrl}
  {name}
/>
