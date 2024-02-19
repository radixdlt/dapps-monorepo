<script lang="ts">
  import type { AccessRuleNode } from '@api/utils/auth'
  import AccessRule from './AccessRule.svelte'
  import ComplexAuthRule from './ComplexAuthRule.svelte'
  import type { TokenInfo } from './TokenInfo'

  export let accessRules: AccessRuleNode[]
  export let type: 'All Of' | 'Any Of' | `At Least ${number} Of`
  export let tokenInfo: TokenInfo
</script>

<AccessRule
  name={type}
  --color={type === 'All Of'
    ? 'rgba(0, 187, 249, 0.05)'
    : type === 'Any Of'
    ? 'rgba(254, 228, 64, 0.05)'
    : 'rgba(235, 130, 88, 0.05)'}
>
  <svelte:fragment slot="content">
    <div class="rules">
      {#each accessRules as rule}
        <ComplexAuthRule {rule} {tokenInfo} />
      {/each}
    </div>
  </svelte:fragment>
</AccessRule>

<style>
  .rules {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
