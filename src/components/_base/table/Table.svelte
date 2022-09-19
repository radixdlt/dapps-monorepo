<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import {
    createSvelteTable,
    type TableOptions,
    getCoreRowModel,
    type ColumnDef,
    flexRender
  } from '@tanstack/svelte-table'
  import { writable } from 'svelte/store'
  import { css } from '@styles'

  export let data
  export let columns: Array<ColumnDef<unknown>>

  const options = writable<TableOptions<unknown>>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const table = createSvelteTable(options)

  const tableStyle = css({
    width: '$1',
    borderCollapse: 'collapse'
  })

  const trHeadStyle = css({
    'th:nth-child(1)': {
      borderTopLeftRadius: '$md'
    },
    'th:nth-last-child(1)': {
      borderTopRightRadius: '$md'
    }
  })

  const thStyle = css({
    borderTopWidth: '$sm',
    borderBottom: 'solid $borderColor',
    padding: '$lg',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    fontWeight: '$600'
  })

  const tdStyle = css({
    padding: '$lg'
  })

  const trStyle = css({
    borderColor: '$borderColor',
    borderStyle: 'solid',
    borderWidth: '$0',
    borderBottomWidth: '$sm'
  })
</script>

<Box>
  <table class={tableStyle()}>
    <thead>
      {#each $table.getHeaderGroups() as headerGroup}
        <tr class={trHeadStyle()}>
          {#each headerGroup.headers as header}
            <th class={thStyle()}>
              {#if !header.isPlaceholder}
                <svelte:component
                  this={flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each $table.getRowModel().rows as row}
        <tr class={trStyle()}>
          {#each row.getVisibleCells() as cell}
            <td class={tdStyle()}>
              <svelte:component
                this={flexRender(cell.column.columnDef.cell, cell.getContext())}
              />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</Box>
