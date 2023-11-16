<script lang="ts" context="module">
  import type { TableColumn, TableConfig } from '../types'

  export type BasicTableColumn<Entry = any> = TableColumn<Entry> & {
    /**
     * For rendering a simple value. Returns data that will be displayed in the cell.
     */
    renderAs?: (entry: Entry) => string | number

    /**
     * Component to be rendered instead of text content
     */
    component?: new (...args: any[]) => SvelteComponent
    componentProps?: Record<
      string,
      string | number | boolean | Record<string, any> | ((value: Entry) => any)
    >
  }
</script>

<script lang="ts">
  import ResponsiveTableCell from './ResponsiveTableCell.svelte'
  import TableRow from './TableRow.svelte'
  import type { ComponentProps, SvelteComponent } from 'svelte'
  import Table from '../Table.svelte'
  import BasicHeader from '../basic-header/BasicHeader.svelte'

  type T = $$Generic<Entry>

  export let entries: ComponentProps<Table<T>>['entries']
  export let columns: BasicTableColumn<T>[]
  export let config: TableConfig<T> | undefined = undefined
  export let defaultSortedColumn: ComponentProps<
    Table<T>
  >['defaultSortedColumn'] = undefined

  interface $$Slots {
    'header-cell': {
      column: BasicTableColumn<T> | null
      sort: () => void
      sortStatus: 'ascending' | 'descending' | 'unsorted'
    }
    row: {
      entry: T
    }
    cell: {
      column: BasicTableColumn<T> | null
      entry: T
    }
  }

  const transformProps = (columnConfig: BasicTableColumn<T>, entry: T) => {
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
</script>

<div class="basic-table">
  <Table {config} {entries} {columns} {defaultSortedColumn}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->

    <slot
      name="header-cell"
      slot="header-cell"
      let:column
      let:sort
      let:sortStatus
      {column}
      {sort}
      {sortStatus}
    >
      <BasicHeader
        on:click={sort}
        alignment={column?.alignment}
        sorting={column?.sortBy ? sortStatus : undefined}
      >
        {#if column?.header?.label}
          {column.header.label}
        {/if}
      </BasicHeader>
    </slot>

    <svelte:fragment slot="empty-row" let:entry>
      <slot name="row" {entry}>
        <TableRow
          customClass={config?.onRowClick ? 'clickable' : ''}
          on:click={() => config?.onRowClick?.(entry)}
        >
          {#each columns as column}
            <ResponsiveTableCell
              label={column?.header?.label}
              alignment={column?.alignment}
              hideMobile={column?.hideMobile}
              hideDesktop={column?.hideDesktop}
            >
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
    </svelte:fragment>
  </Table>
</div>

<style lang="scss">
  @use '../shared.scss';

  .cell-text {
    font-weight: var(--font-weight-bold-2);

    @include mixins.desktop {
      font-weight: var(--font-weight-bold-1);
    }
  }

  .basic-table {
    :global(table) {
      border-collapse: separate;
      @include mixins.desktop {
        border-spacing: 0 shared.$row-spacing;
      }

      width: 100%;
    }
  }

  .basic-table :global(thead) :global(th) {
    &:first-child {
      padding-left: var(--spacing-xl);
    }
    &:last-child {
      padding-right: var(--spacing-xl);
    }
  }
</style>
