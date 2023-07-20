<script lang="ts">
  import { sort } from './sorting'
  import type { TableConfig, Entry, TableColumn } from './types'
  import TableRow from './TableRow.svelte'
  import SortIcon from './SortIcon.svelte'
  import ResponsiveTableCell from './ResponsiveTableCell.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'

  type T = $$Generic<Entry>

  export let entries: Promise<T[]>
  export let config: TableConfig<T>

  let sortedEntries: T[] = []
  let lastSortedBy: number
  let ascendingSort = true
  let sortStatus: ('ascending' | 'descending' | 'unsorted')[] = Array(
    config.columns.length
  ).fill('unsorted')

  const transformProps = (columnConfig: TableColumn, entry: T) => {
    if (!columnConfig.componentProps) {
      return {}
    }

    return Object.entries(columnConfig.componentProps).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string' && value.startsWith('$$')) {
          acc[key] = entry[value.slice(2)]
        } else if (typeof value === 'function') {
          acc[key] = value(entry)
        } else {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string | number | boolean | Record<string, any>>
    )
  }

  const sortColumn = (
    column: (typeof config)['columns'][number],
    index: number
  ) => {
    if (!column || !column.sortBy) return

    if (lastSortedBy) {
      sortStatus[lastSortedBy] = 'unsorted'
    }

    ascendingSort = index === lastSortedBy ? !ascendingSort : false
    lastSortedBy = index
    const direction = ascendingSort ? 'ascending' : 'descending'
    sortStatus[index] = direction

    entries.then((e) => {
      sortedEntries = sort(e, column, direction)
    })
  }
</script>

<table>
  <thead class="desktop-only">
    <tr>
      {#each config.columns as column, i}
        <th>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="flex-align-center"
            class:sortable={!!column?.sortBy}
            on:click={() => sortColumn(column, i)}
          >
            {#if column && column.label}
              <span>{column.label}</span>
            {/if}
            {#if column?.sortBy}
              <SortIcon mode={sortStatus[i] || 'unsorted'} />
            {/if}
          </div>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#await entries}
      {#each Array(3) as _}
        <TableRow>
          {#each config.columns as column}
            <ResponsiveTableCell label={column?.label}>
              <SkeletonLoader height={30} width={200} />
            </ResponsiveTableCell>
          {/each}
        </TableRow>
      {/each}
    {:then entries}
      {#each lastSortedBy ? sortedEntries : entries as entry, i}
        <slot name="row" {entry} {i}>
          <TableRow>
            {#each config.columns as column}
              <ResponsiveTableCell label={column?.label}>
                {#if !$$slots.cell}
                  {#if !column?.component}
                    {#if column?.renderAs}
                      <span class="cell-text">
                        {column?.renderAs(entry)}
                      </span>
                    {/if}
                  {:else}
                    <svelte:component
                      this={column.component}
                      {...transformProps(column, entry)}
                    />
                  {/if}
                {:else}
                  <span class="cell-text">
                    <slot name="cell" {column} {entry}>
                      {#if column?.renderAs}
                        {column?.renderAs(entry)}
                      {/if}
                    </slot>
                  </span>
                {/if}
              </ResponsiveTableCell>
            {/each}
          </TableRow>
        </slot>
      {/each}
      <slot />
    {/await}
  </tbody>
</table>

<style lang="scss">
  @use '../../../mixins.scss';
  @mixin text-style {
    white-space: nowrap;
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
    text-transform: uppercase;
  }

  .sortable {
    cursor: pointer;
    gap: var(--spacing-xs);
  }

  .header-text {
    white-space: nowrap;
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
    text-transform: uppercase;
  }

  .cell-text {
    font-weight: var(--font-weight-bold-2);

    @include mixins.desktop {
      font-weight: var(--font-weight-bold-1);
    }
  }

  .flex-align-center {
    display: inline-flex;
    align-items: center;
  }

  table {
    border-collapse: separate;
    @include mixins.desktop {
      border-spacing: 0 20px;
    }

    width: 100%;
  }

  thead {
    th {
      text-align: left;
      span {
        @include text-style;
      }

      &:first-child {
        padding-left: 20px;
      }

      &:last-child {
        padding-right: 20px;
      }
    }
  }
</style>
