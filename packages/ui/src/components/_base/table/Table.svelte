<script lang="ts">
  import { sort } from './sorting'

  import type { TableColumn, TableConfig } from './types'

  import TableRow from './TableRow.svelte'

  import SortIcon from './SortIcon.svelte'
  import ResponsiveTableCell from './ResponsiveTableCell.svelte'

  type T = $$Generic
  export let entries: any[]
  export let config: TableConfig

  let sortedEntries: any[] = []
  let lastSortedBy: string | number | symbol
  let ascendingSort = true
  let sortStatus: Record<
    string | number | symbol,
    'ascending' | 'descending' | 'unsorted'
  > = {}

  const transformProps = (columnConfig: TableColumn, entry: any) => {
    if (!columnConfig.componentProps) {
      return {}
    }

    return Object.entries(columnConfig.componentProps).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string' && value.startsWith('$$')) {
          acc[key] = entry[value.slice(2)]
        } else {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string>
    )
  }

  const sortColumn = (column: TableColumn) => {
    const property = column?.property

    if (!property || !column?.sortable) {
      return
    }
    if (lastSortedBy) {
      sortStatus[lastSortedBy] = 'unsorted'
    }

    ascendingSort = property === lastSortedBy ? !ascendingSort : true
    lastSortedBy = property
    const direction = ascendingSort ? 'ascending' : 'descending'
    sortStatus[property] = direction

    sortedEntries = sort(entries, column, direction)
  }
</script>

<table>
  <thead class="desktop-only">
    <tr>
      {#each config.columns as column}
        <th>
          <div
            class="flex-align-center {column.sortable ? 'sortable' : ''}"
            on:click={() => sortColumn(column)}
            on:keypress={(ev) => console.log(ev)}
          >
            {#if column.label}
              <span>{column.label}</span>
            {/if}
            {#if column.sortable}
              <SortIcon
                mode={column?.property
                  ? sortStatus[column.property] || 'unsorted'
                  : 'unsorted'}
              />
            {/if}
          </div>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each lastSortedBy ? sortedEntries : entries as entry, i}
      <slot name="row" {entry} {i}>
        <TableRow>
          {#each config.columns as column}
            <ResponsiveTableCell label={column.label}>
              {#if !column.component}
                {#if column.property}
                  <span class="cell-text">
                    {column.transform
                      ? column.transform(entry)
                      : entry[column.property]}
                  </span>
                {/if}
              {:else}
                <svelte:component
                  this={column.component}
                  {...transformProps(column, entry)}
                />
              {/if}
            </ResponsiveTableCell>
          {/each}
        </TableRow>
      </slot>
    {/each}
    <slot />
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
