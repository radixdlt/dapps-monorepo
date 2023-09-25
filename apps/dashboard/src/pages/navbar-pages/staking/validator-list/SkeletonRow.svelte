<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import ResponsiveTableCell from '@components/_base/table/basic-table/ResponsiveTableCell.svelte'
  import TableRow from '@components/_base/table/basic-table/TableRow.svelte'

  export let columns: number
</script>

<TableRow>
  <ResponsiveTableCell colspan={columns}>
    <SkeletonLoader />
  </ResponsiveTableCell>
</TableRow>
