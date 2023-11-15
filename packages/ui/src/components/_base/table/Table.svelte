<script lang="ts" context="module">
  import Tooltip from '../tooltip/Tooltip.svelte'
</script>

<script lang="ts">
  import { useSorting } from './sorting'

  import type { TableColumn } from './types'

  type T = $$Generic<Entry>

  export let entries: T[]
  export let columns: TableColumn<T>[]
  export let defaultSortedColumn:
    | NonNullable<(typeof columns)[number]>['id']
    | undefined = undefined

  const { sort, sortStatus } = useSorting(columns, defaultSortedColumn)
</script>

<table>
  <thead class="desktop-only">
    <tr>
      <slot name="header" {sort} {sortStatus}>
        {#each columns as column, i}
          <th style:text-align={column?.header?.alignment ?? 'left'}>
            <Tooltip
              headerText={column?.header?.tooltip && column?.header?.label}
              text={column?.header?.tooltip}
            >
              <slot
                name="header-cell"
                {column}
                sort={() => (entries = sort(column, i)(entries))}
                sortStatus={$sortStatus[i]}
              />
            </Tooltip>
          </th>
        {/each}
      </slot>
    </tr>
  </thead>

  <tbody>
    {#each entries as entry}
      <slot name="empty-row" {entry}>
        <tr>
          <slot name="row" {entry} />
        </tr>
      </slot>
    {/each}
  </tbody>
</table>
