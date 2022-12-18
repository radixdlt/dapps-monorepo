<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Box from '../box/Box.svelte'
  import Search from '../search/Search.svelte'
  import Table from './Table.svelte'

  const validators = [
    {
      address: 'rv1qggax7sd4ajv4693zg3fynqlyzutw9rwyk6q8dvzsfryml6jk6dxq2uz82c',
      name: '🍼 Mleekko Staking',
      totalStake: 27746277.43,
      ownerStake: 79868.57,
      uptimePercentage: 100,
      feePercentage: 2.5,
      stakePercentage: 0.86,
      ownerStakePercentage: 0.29,
      stakeAccepted: true
    },
    {
      address: 'rv1q0es0alm8vkuwsq66uy7elc4g7xal6npr2r3a5q6as042u4704nyuw8sdzs',
      name: 'Trust Staking',
      totalStake: 27447175.41,
      ownerStake: 24661.36,
      uptimePercentage: 100,
      feePercentage: 7.5,
      stakePercentage: 0.85,
      ownerStakePercentage: 0.09,
      stakeAccepted: true
    },
    {
      address: 'rv1q07zueawn3fcj79npf88prwqfwn3hsu5e60rwh5ft76tvpc36c52unus0pt',
      name: 'RadixStaking.com',
      totalStake: 26731557.53,
      ownerStake: 5050201.13,
      uptimePercentage: 100,
      feePercentage: 1,
      stakePercentage: 0.83,
      ownerStakePercentage: 18.89,
      stakeAccepted: true
    },
    {
      address: 'rv1qw0dvrdx7q7mrkf09g90w49t6kpud4pgf24cpx6zthpnxe7a8msjjkmavdd',
      name: 'Radix Pay',
      totalStake: 25105086.15,
      ownerStake: 83382.26,
      uptimePercentage: 100,
      feePercentage: 1,
      stakePercentage: 0.78,
      ownerStakePercentage: 0.33,
      stakeAccepted: true
    },
    {
      address: 'rv1qgrcl8ecx2zzr6kvdytduf3v7t5hntaa05nq7f3jxhfu73360sqjuf82pnu',
      name: 'Peachys Validator',
      totalStake: 21517553.85,
      ownerStake: 6048220.21,
      uptimePercentage: 99.67,
      feePercentage: 3,
      stakePercentage: 0.67,
      ownerStakePercentage: 28.11,
      stakeAccepted: true
    }
  ]

  // ts ignores due to svelte table's lack of types
  const columns = [
    {
      accessorKey: 'name',
      // @ts-ignore
      cell: (info) => info.getValue(),
      header: 'Name'
    },
    {
      // @ts-ignore
      accessorFn: (row) => row.feePercentage,
      id: 'feepercentage',
      // @ts-ignore
      cell: (info) => info.getValue(),
      header: () => 'Fee %'
    },
    {
      // @ts-ignore
      accessorFn: (row) => row.totalStake,
      id: 'totalstake',
      header: () => 'Total Stake'
    },
    {
      accessorKey: 'ownerStake',
      header: () => 'Owner Stake'
    },
    {
      accessorKey: 'uptimePercentage',
      header: 'Uptime %'
    },
    {
      accessorKey: 'stakeAccepted',
      header: 'Stake Accepted'
    }
  ]

  let filtered = ''
</script>

<Meta title="Table" />

<Box>
  <Search onSearch={() => {}} />
  <Story name="Primary"
    ><Table bind:globalFilter={filtered} {columns} data={validators} /></Story
  >
</Box>
