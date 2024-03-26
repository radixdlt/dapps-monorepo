<script lang="ts">
  import type { TransactionBalanceChanges } from '@common/gateway-sdk'
  export let balanceChanges: TransactionBalanceChanges | undefined

  let accountBalanceChanges: Set<string>
  let componentBalanceChanges: Set<string>

  $: {
    accountBalanceChanges = new Set<string>()
    componentBalanceChanges = new Set<string>()
    updateOtherBalanceChangesCount(balanceChanges)
  }

  const updateOtherBalanceChangesCount = (
    _balanceChanges?: TransactionBalanceChanges
  ) => {
    const addToBalanceChangesSets = (
      changes: { entity_address: string }[] = []
    ) => {
      changes.forEach((balanceChange) => {
        if (balanceChange.entity_address.startsWith('component_')) {
          componentBalanceChanges.add(balanceChange.entity_address)
        }

        if (balanceChange.entity_address.startsWith('account_')) {
          accountBalanceChanges.add(balanceChange.entity_address)
        }
      })
    }
    addToBalanceChangesSets(_balanceChanges?.fungible_balance_changes)
    addToBalanceChangesSets(_balanceChanges?.non_fungible_balance_changes)
    addToBalanceChangesSets(_balanceChanges?.fungible_fee_balance_changes)
  }
</script>

{#if componentBalanceChanges.size}<div class="text">
    {componentBalanceChanges.size} Component{#if componentBalanceChanges.size > 1}s{/if}
  </div>{/if}
{#if accountBalanceChanges.size}<div class="text">
    {accountBalanceChanges.size} Account{#if accountBalanceChanges.size > 1}s{/if}
  </div>{/if}

{#if !balanceChanges}
  Balance changes loading... please reload in a few minutes.
{:else if !accountBalanceChanges.size && !componentBalanceChanges.size}
  -
{/if}

<style lang="scss">
  .text {
    font-weight: var(--font-weight-bold-1);
  }
</style>
