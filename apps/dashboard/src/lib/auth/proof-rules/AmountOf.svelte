<script lang="ts">
  import type { AmountOfProofRule } from '@api/utils/auth'
  import ResourceProofRule from './ResourceProofRule.svelte'
  import type { TokenInfo } from '../TokenInfo'

  export let rule: AmountOfProofRule

  export let tokenInfo: TokenInfo
  let token = tokenInfo.fungibles.get(rule.resource)

  $: token = tokenInfo.fungibles.get(rule.resource)
</script>

<ResourceProofRule
  amount={rule.amount}
  resourceAddress={rule.resource}
  resourceName={token?.metadata.standard.name?.value}
  resourceIconUrl={token?.metadata.standard.icon_url?.value.href}
  resourceSymbol={token?.metadata.standard.symbol?.value}
/>
