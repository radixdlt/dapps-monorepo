<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import {
    createSvelteTable,
    type TableOptions,
    getCoreRowModel,
    type ColumnDef,
    flexRender,
    type ColumnSort,
    getSortedRowModel,
    getFilteredRowModel
  } from '@tanstack/svelte-table'
  import { writable } from 'svelte/store'
  import { css } from '@styles'
  import { afterUpdate } from 'svelte'
  import { includesString } from './filters'

  export let data: any
  export let columns: Array<ColumnDef<unknown>>
  export let globalFilter: string | undefined = undefined

  let sorting: ColumnSort[] = []

  const setGlobalFilter = () => {
    options.update((old) => ({
      ...old,
      state: {
        ...old.state,
        globalFilter
      }
    }))
  }

  afterUpdate(setGlobalFilter)

  const setSorting = (updater: ColumnSort[] | Function) => {
    if (updater instanceof Function) {
      sorting = updater(sorting)
    } else {
      sorting = updater
    }
    options.update((old) => ({
      ...old,
      state: {
        ...old.state,
        sorting
      }
    }))
  }

  const options = writable<TableOptions<unknown>>({
    data,
    columns,
    state: {
      sorting,
      globalFilter
    },
    globalFilterFn: includesString,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  $: options.update((options) => ({
    ...options,
    data,
    columns
  }))

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

<Box bgColor="surface" p="none">
  <table class={tableStyle()}>
    <thead>
      {#each $table.getHeaderGroups() as headerGroup}
        <tr class={trHeadStyle()}>
          {#each headerGroup.headers as header}
            <th class={thStyle()}>
              {#if !header.isPlaceholder}
                <Box
                  interactiveText
                  p="none"
                  pointer={header.column.getCanSort()}
                  on:click={() => header.column.getToggleSortingHandler()}
                >
                  <svelte:component
                    this={flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  />
                  <Box p="none" inline bgColor="surface" mx="small">
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽'
                    }[header.column.getIsSorted().toString()] ?? ''}
                  </Box>
                </Box>
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
