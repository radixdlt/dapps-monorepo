<script lang="ts">
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import type { ComponentProps } from 'svelte'

  type T = $$Generic

  export let queryFunction: ComponentProps<PaginatedTable<T>>['queryFunction']

  const columns: ComponentProps<PaginatedTable<any>>['columns'] = [
    {
      header: {
        label: 'ID/DATE (GMT +00)'
      },
      component: DateAndTxIdColumn,
      componentProps: {
        id: '$$intent_hash',
        date: '$$confirmed_at'
      }
    },
    {
      header: {
        label: 'Fee'
      },
      renderAs: (entry: any) => `${entry.fee_paid} XRD`
    },
    {
      header: {
        label: 'Status'
      },
      renderAs: (entry: any) => entry.transaction_status
    }
  ]
</script>

<PaginatedTable {columns} {queryFunction} />
