<script lang="ts">
  import type { TableColumn } from '../types'
  import Section from './Section.svelte'

  type T = $$Generic

  export let columns: Readonly<
    (TableColumn<T> & { id: NonNullable<TableColumn<T>['id']> })[]
  >
</script>

<div
  class="grid-table"
  style:grid-template-columns="repeat(auto, {columns.length})"
>
  {#each columns as column, i}
    <div style:grid-column={i + 1}>
      <slot name="header-cell" {column} />
    </div>
  {/each}

  <slot {Section} />
</div>

<style lang="scss">
  .grid-table {
    display: grid;
  }
</style>
