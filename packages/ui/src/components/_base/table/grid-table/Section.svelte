<script lang="ts">
  type ID = $$Generic<string>

  type ColumnIdentifier = number | ID

  export let columns: Readonly<ID[]> | Readonly<{ id: ID }[]>
  export let renderAt:
    | (ColumnIdentifier | { start: ColumnIdentifier; end: ColumnIdentifier })
    | undefined = undefined

  $: _columns = columns.map((c) =>
    typeof c === 'string' ? c : c.id
  ) as Readonly<ID[]>

  const getIndexOfColumn = (column: ColumnIdentifier) =>
    typeof column === 'number' ? column : _columns.indexOf(column)

  $: start = renderAt
    ? getIndexOfColumn(typeof renderAt === 'object' ? renderAt.start : renderAt)
    : 0

  $: end = renderAt
    ? getIndexOfColumn(typeof renderAt === 'object' ? renderAt.end : renderAt)
    : _columns.length

  $: subColumns = _columns.slice(start, end)
</script>

<div class="row" style:grid-column="{start + 1} / {end + 2}">
  <slot columns={subColumns} />
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: subgrid;
  }
</style>
