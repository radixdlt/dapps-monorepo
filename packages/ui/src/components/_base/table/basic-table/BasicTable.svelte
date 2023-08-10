<script lang="ts" context="module">
  export type BasicTableColumn<Entry = any> = TableColumn<Entry> & {
    /**
     * The id of the column. This is used to identify the column when rendering a custom component using slots.
     */
    id?: string

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
  import Table, { type TableColumn, type Entry } from '../Table.svelte'
  import BasicHeader from '../basic-header/BasicHeader.svelte'

  type T = $$Generic<Entry>

  export let entries: ComponentProps<Table<T>>['entries']
  export let columns: (BasicTableColumn<T> | null)[]
  export let defaultSortedColumn: number | undefined = undefined

  interface $$Slots {
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
  <Table {entries} {columns} {defaultSortedColumn}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->

    <BasicHeader
      slot="header-cell"
      let:column
      let:sort
      let:sortStatus
      on:click={sort}
      sorting={column?.sortBy ? sortStatus : undefined}
    >
      {#if column?.header?.label}
        {column.header.label}
      {/if}
    </BasicHeader>

    <svelte:fragment slot="empty-row" let:entry>
      <slot name="row" {entry}>
        <TableRow>
          {#each columns as column}
            <ResponsiveTableCell label={column?.header?.label}>
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
  @use '../../../../mixins.scss';

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
