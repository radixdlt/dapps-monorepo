<script lang="ts">
  import { formatTokenValue } from '@common/utils/formatting'
  import type BigNumber from 'bignumber.js'

  export let change: BigNumber | 'added' | 'removed'
</script>

<div class="change">
  {#if change === 'added'}
    <span class="added">Added</span>
  {:else if change === 'removed'}
    <span class="removed">Removed</span>
  {:else}
    <span class:added={change.isPositive()} class:removed={change.isNegative()}
      >{change.isPositive() ? '+' : '-'}{formatTokenValue(
        change.isPositive() ? change : change.abs()
      ).displayValue}</span
    >
  {/if}
</div>

<style>
  .change {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold-2);
  }

  .added {
    color: var(--theme-success-primary);
  }

  .removed {
    color: var(--theme-error-primary);
  }
</style>
