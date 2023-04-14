<script lang="ts">
  import { formatAmount } from '@utils'

  export let amount: number
  export let percentage: number
</script>

<div class="stake-display">
  <div class="total">
    {formatAmount(amount)}
  </div>

  <div class="percentage">
    {`(${percentage}%)`}
  </div>
</div>

<style>
  .stake-display {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr / 1fr;
  }

  .total {
    font-weight: var(--font-weight-bold-1);
  }

  .percentage {
    font-weight: var(--font-weight-bold-1);
    font-size: var(--text-sm);
    color: var(--color-grey-2);
  }
</style>
