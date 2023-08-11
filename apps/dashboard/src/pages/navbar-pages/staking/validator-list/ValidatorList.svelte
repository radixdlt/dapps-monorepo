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
      sortBy: 'totalStakeInXRD',
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

  const isEmpty = (obj: any) => {
    return Object.keys(obj).length === 0
  }

  $: if ($connected) {
    columns = [{}, ...columns, {}]
  } else if (isEmpty(columns[0]) && isEmpty(columns[columns.length - 1])) {
    columns = columns.slice(1, -1)
  }
</script>

{#await validators then validators}
  {#if validators.length > 0}
    <div class="validator-list">
      <BasicTable
        {columns}
        entries={validators}
        defaultSortedColumn={columns.findIndex(
          (c) => c?.sortBy === 'totalStakeInXRD'
        )}
      >
        <svelte:fragment slot="row" let:entry>
          <tr><th class="separator" /> </tr>
          <slot name="row" {entry} {columns} />
        </svelte:fragment>
      </BasicTable>
    </div>
  {/if}
{/await}

<style lang="scss">
  @use '../../../../../../../packages/ui/src/components/_base/table/shared.scss';
  .validator-list :global(table) {
    border-spacing: 0 !important;
    min-width: 60rem;

    :global(td) {
      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }
    }
  }

  .separator {
    padding-top: shared.$row-spacing;
  }
</style>
