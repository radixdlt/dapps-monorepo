<script lang="ts" context="module">
  import Tooltip from '../tooltip/Tooltip.svelte'
</script>

<script lang="ts">
  import { useSorting } from './sorting'

  import type { TableColumn } from './types'

  type T = $$Generic<Entry>

  export let entries: T[]
  export let columns: (TableColumn<T> | null)[]
  export let defaultSortedColumn:
    | NonNullable<(typeof columns)[number]>['id']
    | undefined = undefined

  const { sortedEntries, sortColumn, sortStatus, lastSortedBy } = useSorting(
    columns,
    entries,
    defaultSortedColumn
  )
</script>

<table>
  <thead class="desktop-only">
    <tr>
      <slot name="header" sort={sortColumn} {sortStatus}>
        {#each columns as column, i}
          <th style:text-align={column?.header?.alignment ?? 'left'}>
            <Tooltip
              headerText={column?.header?.tooltip && column?.header?.label}
              text={column?.header?.tooltip}
            >
              <slot
                name="header-cell"
                {column}
                sort={() => sortColumn(column, i)}
                sortStatus={sortStatus[i]}
              />
            </Tooltip>
          </th>
        {/each}
      </slot>
    </tr>
  </thead>

  <tbody>
    {#each lastSortedBy ? sortedEntries : entries as entry}
      <slot name="empty-row" {entry}>
        <tr>
          <slot name="row" {entry} />
        </tr>
      </slot>
    {/each}
  </tbody>
</table>
