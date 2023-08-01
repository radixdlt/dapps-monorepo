<script lang="ts">
  import BasicTable from '@components/_base/table/basic-table/BasicTable.svelte'
  import type { Validator } from '../Validators.svelte'
  import type { ComponentProps } from 'svelte'
  import { connected } from '@stores'

  export let validators: Promise<Validator[]>

  interface $$Slots {
    row: {
      entry: Validator
      columns: ComponentProps<BasicTable<Validator>>['columns']
    }
  }

  let columns: ComponentProps<BasicTable<Validator>>['columns'] = [
    {
      header: {
        label: 'VALIDATOR'
      }
    },
    {
      header: {
        label: 'ADDRESS',
        alignment: 'center'
      },
      id: 'address'
    },
    {
      sortBy: 'totalStake',
      header: {
        label: 'TOTAL STAKE',
        alignment: 'center'
      }
    },
    {
      sortBy: 'ownerStake',
      header: {
        label: 'OWNER STAKE',
        alignment: 'center'
      }
    },
    {
      sortBy: 'apy',
      header: {
        label: 'APY',
        alignment: 'center'
      }
    },
    {
      sortBy: 'fee',
      header: {
        label: 'FEE',
        alignment: 'center'
      }
    },
    {
      sortBy: 'uptime',
      header: {
        label: 'UPTIME',
        alignment: 'center'
      }
    },
    {
      header: {
        label: 'ACCEPTS STAKE',
        alignment: 'center'
      }
    }
  ]

  $: if ($connected) columns = [{}, ...columns, {}]
</script>

{#await validators then validators}
  <div class="validator-list">
    <BasicTable {columns} entries={validators}>
      <svelte:fragment slot="row" let:entry>
        <tr><th class="separator" /> </tr>
        <slot name="row" {entry} {columns} />
      </svelte:fragment>
    </BasicTable>
  </div>
{/await}

<style lang="scss">
  @use '../../../../../../../packages/ui/src/components/_base/table/shared.scss';
  .validator-list :global(table) {
    border-spacing: 0 !important;
  }

  .separator {
    padding-top: shared.$row-spacing;
  }
</style>
