<script lang="ts" context="module">
  export type SortableColumn =
    | 'totalStake'
    | 'percentageOwnerStake'
    | 'apy'
    | 'fee'
    | 'uptime'
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import SortIcon from './SortIcon.svelte'

  const dispatch = createEventDispatcher()

  let lastSortedBy: SortableColumn
  let descending = false

  let sortStatus: Record<
    SortableColumn,
    'ascending' | 'descending' | 'unsorted'
  > = {
    totalStake: 'unsorted',
    percentageOwnerStake: 'unsorted',
    apy: 'unsorted',
    fee: 'unsorted',
    uptime: 'unsorted'
  }

  const sort = (by: SortableColumn) => {
    if (lastSortedBy === by) {
      descending = !descending
    } else {
      descending = false
      sortStatus[lastSortedBy] = 'unsorted'
    }

    lastSortedBy = by

    sortStatus[by] = descending ? 'descending' : 'ascending'

    dispatch('sort', { by, descending })
  }
</script>

<div id="column-headers">
  <div />
  <div style:justify-self="start">VALIDATOR</div>
  <div id="address-header">ADDRESS</div>
  <div class="sortable" on:click={() => sort('totalStake')}>
    TOTAL STAKE
    <SortIcon mode={sortStatus['totalStake']} />
  </div>
  <div class="sortable" on:click={() => sort('percentageOwnerStake')}>
    OWNER STAKE (%)
    <SortIcon mode={sortStatus['percentageOwnerStake']} />
  </div>
  <div id="apy-header">
    <div class="sortable" on:click={() => sort('apy')}>
      APY
      <SortIcon mode={sortStatus['apy']} />
    </div>
    <div class="sortable" on:click={() => sort('fee')}>
      FEE
      <SortIcon mode={sortStatus['fee']} />
    </div>
    <div class="sortable" on:click={() => sort('uptime')}>
      UPTIME
      <SortIcon mode={sortStatus['uptime']} />
    </div>
  </div>
  <div>ACCEPTS STAKE</div>
</div>

<style lang="scss">
  @use '../../shared.scss';

  @mixin text-style {
    white-space: nowrap;
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);

    @media screen and (max-width: 1650px) {
      font-size: var(--text-xs);
    }
  }

  #column-headers {
    @include shared.validator-card-grid;
    justify-items: center;

    div {
      @include text-style;
    }

    #apy-header {
      @include shared.apy-box-grid;
      justify-items: center;
    }

    #address-header {
      justify-self: end;
      margin-right: 2rem;
    }
  }

  .sortable {
    @include text-style;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
</style>
