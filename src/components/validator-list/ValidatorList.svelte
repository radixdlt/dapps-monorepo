<script lang="ts">
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

  export let data: ValidatorTransformedArray
  export let filtered = ''

  const columns = [
    {
      accessorKey: 'name',
      cell: (info) => info.getValue(),
      header: 'Name'
    },
    {
      accessorFn: (row) => row.stakeAccepted,
      id: 'stakeAccepted',
      header: () => 'ADS'
    },
    {
      accessorFn: (row) => row.totalStake,
      id: 'totalStake',
      cell: TotalStake,
      header: TotalStakeHeader
    },
    {
      accessorFn: (row) => row.ownerStake,
      id: 'ownerStake',
      cell: OwnerStake,
      header: OwnerStakeHeader
    },
    {
      accessorFn: (row) => row.feePercentage,
      id: 'feepercentage',
      cell: RightAlignedText,
      header: FeeHeader
    },
    {
      accessorFn: (row) => row.uptimePercentage,
      id: 'uptimePercentage',
      cell: RightAlignedText,
      header: UptimeHeader
    },
    {
      accessorKey: 'address',
      cell: (info) => shortenAddress(info.getValue()),
      header: 'Address'
    }
  ]
</script>

<Table globalFilter={filtered} {data} {columns} />
