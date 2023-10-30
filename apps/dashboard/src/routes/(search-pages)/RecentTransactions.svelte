<script lang="ts">
  import ExportCsvButton from '@dashboard-pages/search-pages/export-csv-button/ExportCsvButton.svelte'
  import { getRecentTransactions } from '@api/gateway'
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import type { ComponentProps } from 'svelte'

  type T = $$Generic

  export let entityAddress: string

  const queryFunction = (cursor?: string) =>
    getRecentTransactions(entityAddress, cursor)

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

<div class="export-button">
  <ExportCsvButton {entityAddress} />
</div>

<PaginatedTable {columns} {queryFunction} />

<style lang="scss">
  .export-button {
    text-align: right;
    transform: translateY(-1rem);

    @include mixins.minWidthMedia(820px) {
      position: absolute;
      right: 0;
      transform: none;
      top: 90px;
    }
  }
</style>
