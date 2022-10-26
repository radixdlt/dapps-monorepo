<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Table from '@components/_base/table/Table.svelte'
  import type { ValidatorTransformedArray } from '@types'
  import { shortenAddress } from '@utils'
  import FeeHeader from './cells/FeeHeader.svelte'
  import OwnerStake from './cells/OwnerStake.svelte'
  import OwnerStakeHeader from './cells/OwnerStakeHeader.svelte'
  import RightAlignedText from './cells/RightAlignedText.svelte'
  import TotalStake from './cells/TotalStake.svelte'
  import TotalStakeHeader from './cells/TotalStakeHeader.svelte'
  import UptimeHeader from './cells/UptimeHeader.svelte'

  export let validators: Promise<ValidatorTransformedArray>
  export let filtered = ''

  const loaders = Array(10)

  // ts support for svelte seems to be broken, therefore we need to cast the data
  const columns = [
    {
      accessorKey: 'name',
      // @ts-ignore
      cell: (info) => info.getValue(),
      header: 'Name'
    },
    {
      // @ts-ignore
      accessorFn: (row) => row.stakeAccepted,
      id: 'stakeAccepted',
      header: () => 'ADS'
    },
    {
      // @ts-ignore
      accessorFn: (row) => row.totalStake,
      id: 'totalStake',
      cell: TotalStake,
      header: TotalStakeHeader
    },
    {
      // @ts-ignore
      accessorFn: (row) => row.ownerStake,
      id: 'ownerStake',
      cell: OwnerStake,
      header: OwnerStakeHeader
    },
    {
      // @ts-ignore
      accessorFn: (row) => row.feePercentage,
      id: 'feepercentage',
      cell: RightAlignedText,
      header: FeeHeader
    },
    {
      // @ts-ignore
      accessorFn: (row) => row.uptimePercentage,
      id: 'uptimePercentage',
      cell: RightAlignedText,
      header: UptimeHeader
    },
    {
      accessorKey: 'address',
      // @ts-ignore
      cell: (info) => shortenAddress(info.getValue()),
      header: 'Address'
    }
  ] as any

  const loadingColumns = columns.map((column: any) => ({
    ...column,
    cell: () => SkeletonLoader
  }))
</script>

{#await validators}
  <Table columns={loadingColumns} data={loaders} globalFilter={filtered} />
{:then validators}
  <Table {columns} data={validators} globalFilter={filtered} />
{/await}
