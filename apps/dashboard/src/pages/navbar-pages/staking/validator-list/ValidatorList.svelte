<script lang="ts" context="module">
  export type TransformedValidator = Validator<true, true, true> &
    Validator<unknown, true, unknown>['uptimePercentages'] & {
      feePercentage: number
    }

  export enum ColumnIds {
    stakingIconBookmark = 'staking-icon-or-bookmark',
    icon = 'icon',
    name = 'name',
    address = 'address',
    totalStake = 'totalStake',
    ownerStake = 'ownerStake',
    apy = 'apy',
    feePercentage = 'feePercentage',
    uptime = 'uptime',
    acceptsStake = 'acceptsStake',
    select = 'select'
  }
</script>

<script lang="ts">
  import type { Validator } from '@api/_deprecated/utils/entities/validator'
  import type { ComponentProps } from 'svelte'
  import { connected } from '@stores'
  import { bookmarkedValidatorsStore } from '../../../../stores'
  import GridTable from '@components/_base/table/grid-table/GridTable.svelte'
  import type { UptimeValue } from './UptimeHeader.svelte'
  import BasicHeader from '@components/_base/table/basic-header/BasicHeader.svelte'
  import type { Direction, SortableValues } from '@components/_base/table/types'
  import { sortBigNumber, sortBasic } from '@components/_base/table/sorting'
  import UptimeHeader from './UptimeHeader.svelte'
  import ValidatorRow from './ValidatorRow.svelte'

  interface $$Slots {
    rows: {
      validators: typeof transformedValidators
      columns: ComponentProps<GridTable<TransformedValidator>>['columns']
      selectedUptime: UptimeValue
      columnIds: ColumnIds[]
      ValidatorRow: typeof ValidatorRow
    }
  }

  export let validators:
    | Promise<Validator<true, true, true>[]>
    | Validator<true, true, true>[]

  $: _validators = Promise.resolve(validators)

  let selectedUptime: { label: string; value: UptimeValue }

  let transformedValidators: Promise<TransformedValidator[]>

  $: transformedValidators = _validators.then((resolved) =>
    resolved.map((validator) => ({
      ...validator,
      '1day': validator.uptimePercentages['1day'],
      '1week': validator.uptimePercentages['1week'],
      '1month': validator.uptimePercentages['1month'],
      '3months': validator.uptimePercentages['3months'],
      '6months': validator.uptimePercentages['6months'],
      '1year': validator.uptimePercentages['1year'],
      alltime: validator.uptimePercentages['alltime'],
      feePercentage: validator.fee.percentage
    }))
  )

  const sort =
    (
      key: NonNullable<SortableValues<TransformedValidator>>,
      sortFn: typeof sortBasic | typeof sortBigNumber
    ) =>
    (
      v1: TransformedValidator,
      v2: TransformedValidator,
      direction: Direction
    ) => {
      if (
        $bookmarkedValidatorsStore[v1.address] &&
        !$bookmarkedValidatorsStore[v2.address]
      ) {
        return -1
      } else if (
        !$bookmarkedValidatorsStore[v1.address] &&
        $bookmarkedValidatorsStore[v2.address]
      ) {
        return 1
      } else {
        // @ts-ignore
        return sortFn(v1[key], v2[key], direction)
      }
    }

  let columns: ComponentProps<GridTable<TransformedValidator>>['columns'] = [
    {
      id: ColumnIds.icon
    },
    {
      id: ColumnIds.name,
      header: {
        label: 'Validator',
        alignment: 'left',
        tooltip: 'Name of validator set by its owner'
      }
    },
    {
      id: ColumnIds.address,
      header: {
        label: 'Address',
        tooltip: 'Validator component address'
      }
    },
    {
      id: ColumnIds.totalStake,
      sortBy: sort('totalStakeInXRD', sortBigNumber),
      header: {
        label: 'Total Stake',
        tooltip: 'Total XRD staked to this validator'
      }
    },
    {
      id: ColumnIds.ownerStake,
      sortBy: sort('ownerStake', sortBigNumber),
      header: {
        label: 'Owner Stake',
        tooltip: '% of stake provided by validator’s owner'
      }
    },
    {
      id: ColumnIds.apy,
      sortBy: sort('apy', sortBasic),
      header: {
        label: 'APY',
        tooltip: 'Estimated return based on recent uptime and current fee'
      }
    },
    {
      id: ColumnIds.feePercentage,
      sortBy: sort('feePercentage', sortBasic),
      header: {
        label: 'Fee',
        tooltip: '% of XRD emissions taken by validator owner'
      }
    },
    {
      id: ColumnIds.uptime,
      header: {
        label: 'Uptime',
        tooltip: '% of proposals made over the recent time frame selected'
      }
    },
    {
      id: ColumnIds.acceptsStake,
      header: {
        label: 'Accepts Stake',
        tooltip: 'Does this validator accept third party staking?'
      }
    }
  ]

  const isEmpty = (obj: any) => {
    return Object.keys(obj).length === 0
  }

  $: if ($connected) {
    columns = [
      { id: ColumnIds.stakingIconBookmark },
      ...columns,
      { id: ColumnIds.select }
    ]
  } else if (isEmpty(columns[0]) && isEmpty(columns[columns.length - 1])) {
    columns = columns.slice(1, -1)
  }

  $: if (selectedUptime) {
    columns = columns.map((column) => {
      if (column?.id === 'uptime') {
        return {
          ...column,
          sortBy: sort(selectedUptime.value, sortBasic)
        }
      }

      return column
    })
  }

  $: columnIds = columns.map((column) => column.id) as ColumnIds[]
</script>

<GridTable {columns} defaultSortedColumn="totalStake">
  <div class="header" slot="header-cell" let:column let:sort let:sortStatus>
    {#if column?.id === 'uptime'}
      <UptimeHeader
        on:click={async () => {
          const validators = await transformedValidators
          transformedValidators = Promise.resolve(sort()(validators))
        }}
        sorting={column?.sortBy ? sortStatus : undefined}
        bind:selected={selectedUptime}
      />
    {:else}
      <BasicHeader
        on:click={async () => {
          const validators = await transformedValidators
          transformedValidators = Promise.resolve(sort()(validators))
        }}
        sorting={column?.sortBy ? sortStatus : undefined}
      >
        {#if column?.header?.label}
          {column.header.label}
        {/if}
      </BasicHeader>
    {/if}
  </div>

  <div class="rows" slot="rows">
    <slot
      name="rows"
      validators={transformedValidators}
      {columns}
      {columnIds}
      selectedUptime={selectedUptime?.value}
      {ValidatorRow}
    />
  </div>
</GridTable>

<style>
  .rows {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    grid-row-gap: var(--spacing-lg);
  }
</style>
