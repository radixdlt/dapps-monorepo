<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { PageData } from './$types'
  import Table from '@components/_base/table/Table.svelte'
  import type { TableConfig } from '@components/_base/table/types'
  import Link from '@components/_base/link/Link.svelte'
  export let data: PageData

  const config: TableConfig = {
    columns: [
      {
        label: 'Tx Intent Hash',
        property: 'intent_hash_hex',
        component: Link,
        componentProps: {
          url: (entry: any) => `/transaction/${entry.intent_hash_hex}`,
          text: '$$intent_hash_hex'
        }
      },
      {
        label: 'Fee',
        property: 'fee_paid',
        transform: (entry) => `${entry.fee_paid} XRD`
      },
      {
        label: 'Status',
        property: 'transaction_status'
      }
    ]
  }
</script>

{#await data.promises.transactionList}
  <SkeletonLoader />
{:then transactions}
  <Table {config} entries={transactions.items} />
{/await}
