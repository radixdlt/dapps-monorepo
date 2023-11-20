<script lang="ts">
  import type { AmountOfProofRule } from '@api/utils/auth'
  import ResourceProofRule from './ResourceProofRule.svelte'

  export let rule: AmountOfProofRule
  export let iconUrl: Promise<string | undefined> | undefined
  export let name: Promise<string | undefined> | undefined
</script>

<ResourceProofRule
  amount={rule.amount}
  resourceAddress={rule.resource}
  {iconUrl}
  {name}
/>
