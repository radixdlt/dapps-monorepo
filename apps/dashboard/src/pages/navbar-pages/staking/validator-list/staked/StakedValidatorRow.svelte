<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import ValidatorRow from '../ValidatorRow.svelte'
  import StakingInfo from './StakingInfo.svelte'

  export let validator: ComponentProps<ValidatorRow>['validator']
  export let nbrOfColumns: number
</script>

<tr class="validator-row">
  <ValidatorRow {validator} on:click />
</tr>

<td colspan={nbrOfColumns}>
  <StakingInfo {validator} on:claim-validator />
</td>

<style lang="scss">
  .validator-row {
    display: contents;

    :global(.table-row) {
      &:hover {
        box-shadow: var(--shadow);
      }
    }

    :global(td) {
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
  }
</style>
