<script lang="ts" context="module">
  export type TransformedValidator = Validator<true, true, true> &
    Validator<unknown, true, unknown>['uptimePercentages'] & {
      feePercentage: number
    }
</script>

<script lang="ts">
  import BasicTable from '@components/_base/table/basic-table/BasicTable.svelte'
  import type { Validator } from '@api/utils/entities/validator'
  import type { ComponentProps } from 'svelte'
  import { connected } from '@stores'
  import UptimeHeader, { type UptimeValue } from './UptimeHeader.svelte'
  import BasicHeader from '@components/_base/table/basic-header/BasicHeader.svelte'
  import SkeletonRow from './SkeletonRow.svelte'
  import { bookmarkedValidatorsStore } from '../../../../stores'
  import {
    sortBigNumber,
    type SortableValues,
    sortBasic,
    type Direction
  } from '@components/_base/table/Table.svelte'

  export let validators: Promise<Validator<true, true, true>[]>
  export let loadingRowsCount = 15

  let selectedUptime: { label: string; value: UptimeValue }

  let transformedValidators: Promise<TransformedValidator[]>

  $: transformedValidators = validators.then((resolved) =>
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

  interface $$Slots {
    row: {
      entry: TransformedValidator
      columns: ComponentProps<BasicTable<TransformedValidator>>['columns']
      selectedUptime: UptimeValue
    }
  }

  let columns: ComponentProps<BasicTable<TransformedValidator>>['columns'] = [
    {
      header: {
        label: 'VALIDATOR'
      }
    },
    {
      header: {
        label: 'ADDRESS',
        alignment: 'center'
      }
    },
    {
      id: 'totalStake',
      sortBy: sort('totalStakeInXRD', sortBigNumber),
      header: {
        label: 'TOTAL STAKE',
        alignment: 'center'
      }
    },
    {
      sortBy: sort('ownerStake', sortBigNumber),
      header: {
        label: 'OWNER STAKE',
        alignment: 'center'
      }
    },
    {
      sortBy: sort('apy', sortBasic),
      header: {
        label: 'APY',
        alignment: 'center'
      }
    },
    {
      sortBy: sort('feePercentage', sortBasic),
      header: {
        label: 'FEE',
        alignment: 'center'
      }
    },
    {
      header: {
        label: 'UPTIME',
        alignment: 'center'
      },
      id: 'uptime'
    },
    {
      header: {
        label: 'ACCEPTS STAKE',
        alignment: 'center'
      }
    }
  ]

  const isEmpty = (obj: any) => {
    return Object.keys(obj).length === 0
  }

  $: if ($connected) {
    columns = [{}, ...columns, {}]
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
</script>

{#await transformedValidators}
  <BasicTable {columns} entries={Array(loadingRowsCount).fill(undefined)}>
    <svelte:fragment slot="row">
      <SkeletonRow columns={columns.length} />
    </svelte:fragment>
  </BasicTable>
{:then validators}
  {#if validators.length > 0}
    <div class="validator-list">
      <BasicTable
        {columns}
        entries={validators}
        defaultSortedColumn={'totalStake'}
      >
        <svelte:fragment slot="header-cell" let:column let:sort let:sortStatus>
          {#if column?.id === 'uptime'}
            <UptimeHeader
              on:click={sort}
              sorting={column?.sortBy ? sortStatus : undefined}
              bind:selected={selectedUptime}
            />
          {:else}
            <BasicHeader
              on:click={sort}
              sorting={column?.sortBy ? sortStatus : undefined}
            >
              {#if column?.header?.label}
                {column.header.label}
              {/if}
            </BasicHeader>
          {/if}
        </svelte:fragment>

        <svelte:fragment slot="row" let:entry>
          <tr><th class="separator" /> </tr>
          <slot
            name="row"
            {entry}
            {columns}
            selectedUptime={selectedUptime?.value}
          />
        </svelte:fragment>
      </BasicTable>
    </div>
  {/if}
{/await}

<style lang="scss">
  @use '../../../../../../../packages/ui/src/components/_base/table/shared.scss';
  .validator-list :global(table) {
    border-spacing: 0 !important;
    min-width: 60rem;

    :global(td) {
      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }
    }
  }

  .separator {
    padding-top: shared.$row-spacing;
  }
</style>
