<script lang="ts" context="module">
  import Tooltip from '../tooltip/Tooltip.svelte'
</script>

<script lang="ts">
  import { useSorting } from './sorting'

  import type { TableColumn, TableConfig } from './types'

  type T = $$Generic<Entry>

  export let entries: T[]
  export let config: TableConfig<T> | undefined = undefined
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
          {#if !column?.hideDesktop}
            <th
              style:text-align={(column?.alignment ||
                column?.header?.alignment) ??
                'left'}
              style:width={column?.width ?? 'auto'}
            >
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
          {/if}
        {/each}
      </slot>
    </tr>
  </thead>

  <tbody>
    {#each entries as entry}
      <slot name="empty-row" {entry}>
        <tr
          class:clickable={!!config?.onRowClick}
          on:click={() => config && config.onRowClick?.(entry)}
        >
          <slot name="row" {entry} />
        </tr>
      </slot>
    {/each}
  </tbody>
</table>

<style lang="scss">
  .clickable {
    cursor: pointer;
  }
</style>
