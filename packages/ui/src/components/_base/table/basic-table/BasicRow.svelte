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
  import type { SvelteComponent } from 'svelte'
  import TableRow from './TableRow.svelte'
  import BasicColumn from './BasicColumn.svelte'
  type T = $$Generic<Entry>

  export let columns: BasicTableColumn<T>[]
  export let config: TableConfig<T> | undefined = undefined
  export let entry: T
</script>

<TableRow
  customClass={config?.onRowClick ? 'clickable' : ''}
  on:click={(ev) => config?.onRowClick?.(entry, ev)}
>
  {#each columns as column}
    <BasicColumn {column} {entry} />
  {/each}
</TableRow>
