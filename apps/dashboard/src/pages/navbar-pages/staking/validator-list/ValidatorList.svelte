<script lang="ts" context="module">
  export type TransformedValidator = ValidatorListItem<true, true> & {
    feePercentage: number
  }

  export type ValidatorListInput =
    | Promise<ValidatorListItem<true, true>[]>
    | ValidatorListItem<true, true>[]

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
  import type { ComponentProps } from 'svelte'
  import { connected } from '@stores'
  import { bookmarkedValidatorsStore } from '../../../../stores'
  import GridTable from '@components/_base/table/grid-table/GridTable.svelte'
  import BasicHeader from '@components/_base/table/basic-header/BasicHeader.svelte'
  import type { Direction, SortableValues } from '@components/_base/table/types'
  import { sortBigNumber, sortBasic } from '@components/_base/table/sorting'
  import UptimeHeader from './UptimeHeader.svelte'
  import ValidatorRow from './ValidatorRow.svelte'
  import {
    type UptimeValue,
    type ValidatorListItem
  } from '@api/utils/entities/component/validator'
  import { currentEpoch } from '@dashboard/routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/+layout.svelte'
  import { uptimeModule } from '@dashboard/lib/validators/uptime-module'

  interface $$Slots {
    rows: {
      validators: typeof transformedValidators
      columns: ComponentProps<GridTable<TransformedValidator>>['columns']
      selectedUptime: UptimeValue
      columnIds: ColumnIds[]
      ValidatorRow: typeof ValidatorRow
    }
  }

  export let validators: ValidatorListInput

  $: _validators = Promise.resolve(validators)

  let showTable = true

  $: _validators.then((validators) => {
    showTable = validators.length > 0
  })

  let selectedUptime: UptimeValue

  let transformedValidators: Promise<TransformedValidator[]>

  $: transformedValidators = Promise.all([_validators, $currentEpoch]).then(
    ([validators, epoch]) =>
      (validators || []).map((validator) => ({
        ...validator,
        feePercentage: validator.fee(epoch).percentage
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
      sortBy: (
        v1: TransformedValidator,
        v2: TransformedValidator,
        direction: Direction
      ) => {
        const apy1 = uptimeModule.getApy(v1.validator, selectedUptime)
        const apy2 = uptimeModule.getApy(v2.validator, selectedUptime)
        return sortBasic(apy1 || 0, apy2 || 0, direction)
      },
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
      sortBy: (
        v1: TransformedValidator,
        v2: TransformedValidator,
        direction: Direction
      ) => {
        const data = uptimeModule.getDataForUptime(selectedUptime)
        const uptime1 = data?.[v1.address] || 0
        const uptime2 = data?.[v2.address] || 0
        return sortBasic(uptime1, uptime2, direction)
      },
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

  $: columnIds = columns.map((column) => column.id) as ColumnIds[]

  const onHeaderClick =
    (sortFn: () => (data: TransformedValidator[]) => TransformedValidator[]) =>
    () => {
      transformedValidators = transformedValidators.then(sortFn())
    }
</script>

{#if showTable}
  <GridTable {columns} defaultSortedColumn="apy">
    <div class="header" slot="header-cell" let:column let:sort let:sortStatus>
      {@const sorting = column?.sortBy ? sortStatus : undefined}
      {#if column?.id === 'uptime'}
        <UptimeHeader
          on:click={onHeaderClick(sort)}
          {sorting}
          bind:selected={selectedUptime}
        />
      {:else}
        <BasicHeader on:click={onHeaderClick(sort)} {sorting}>
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
        {selectedUptime}
        {ValidatorRow}
      />
    </div>
  </GridTable>
{/if}

<style>
  .rows {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    grid-row-gap: var(--spacing-lg);
  }
</style>
