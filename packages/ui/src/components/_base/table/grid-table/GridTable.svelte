<script lang="ts">
  import { useSorting } from '../sorting'
  import type { TableColumn } from '../types'
  import Section from './Section.svelte'
  import type { Entry } from '../types'

  type T = $$Generic<Entry>

  export let columns: Readonly<
    (TableColumn<T> & { id: NonNullable<TableColumn<T>['id']> })[]
  >
  export let defaultSortedColumn:
    | NonNullable<(typeof columns)[number]>['id']
    | undefined = undefined

  const { sort, sortStatus } = useSorting(columns, defaultSortedColumn)
</script>

<div
  class="grid-table"
  style="--grid-template-columns-length: {columns.length}"
>
  {#each columns as column, i}
    <div
      class="header"
      style:grid-column={i + 1}
      class:left-aligned={column.header?.alignment === 'left'}
      class:right-aligned={column.header?.alignment === 'right'}
    >
      <slot
        name="header-cell"
        {column}
        sort={sort.bind(null, column, i)}
        sortStatus={$sortStatus[i]}
      />
    </div>
  {/each}

  <slot name="rows" {Section} />
</div>

<style lang="scss">
  .grid-table {
    display: grid;
    @include mixins.desktop {
      grid-template-columns: repeat(var(--grid-template-columns-length), auto);
    }
  }

  .header {
    display: none;
    justify-content: center;
    align-items: center;
    height: 3rem;

    @include mixins.desktop {
      display: flex;
    }
  }

  .left-aligned {
    justify-content: flex-start;
  }

  .right-aligned {
    justify-content: flex-end;
  }
</style>
