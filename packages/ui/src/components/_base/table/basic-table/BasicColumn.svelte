<script lang="ts">
  import type { BasicTableColumn } from './BasicRow.svelte'
  import ResponsiveTableCell from './ResponsiveTableCell.svelte'
  type T = $$Generic<Entry>
  export let column: BasicTableColumn<T>
  export let entry: T

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
