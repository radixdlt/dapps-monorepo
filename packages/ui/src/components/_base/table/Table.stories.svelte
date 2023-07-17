<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Table from './Table.svelte'
  import Icon from '../icon/Icon.svelte'
  import Address from '../address/Address.svelte'
  import TableRow from './TableRow.svelte'
  import ResponsiveTableCell from './ResponsiveTableCell.svelte'
  import Checkmark from '@icons/checkmark.svg'
  import type { TableConfig } from './types'
  import Pagination from './Pagination.svelte'
  import { formatAmount } from '../../../utils'

  const validatorAddresses = [
    'validator_1234567890',
    'validator_1234567891',
    'validator_1234567892',
    'validator_1234567893'
  ]

  const validatorNames = [
    'RADNODE🔥',
    'XIDAR🏅',
    'Jazzer 🌍 DefiPlaza',
    '🐱 Ocinode'
  ]

  const validator = (i: number) => ({
    name: validatorNames[i % 4],
    address: validatorAddresses[i % 4],
    totalStake: Math.floor(Math.random() * 300000),
    percentageOwnerStake: (Math.random() * 30).toFixed(2),
    apy: (Math.random() * 30).toFixed(2),
    fee: (Math.random() * 15).toFixed(2),
    uptime: `${Math.floor(Math.random() * 100)} %`,
    acceptsStake: Math.random() > 0.5 ? true : false,
    ownerStake: (Math.random() * 50).toFixed(2)
  })

  const entries = Array(6)
    .fill(undefined)
    .map((_, i) => validator(i))

  const config: TableConfig<ReturnType<typeof validator>> = {
    columns: [
      {
        label: 'Validator',
        property: 'name'
      },
      {
        label: 'Address',
        property: 'address',
        component: Address,
        componentProps: {
          short: true,
          value: '$$address'
        }
      },
      {
        label: 'Total Stake',
        property: 'totalStake',
        transform: (entry) => formatAmount(entry.totalStake),
        sortable: true
      },
      {
        label: 'Owner Stake (%)',
        property: 'ownerStake',
        transform: (entry) => `${entry.ownerStake} %`,
        sortable: true
      },
      {
        label: 'APY',
        property: 'apy',
        transform: (entry) => `${entry.apy} %`,
        sortable: true
      },
      {
        label: 'Fee',
        property: 'fee',
        sortable: true,
        transform: (entry) => `${entry.fee} %`
      },
      {
        label: 'Uptime',
        property: 'uptime',
        sortable: true
      },
      {
        label: 'Accepts stake',
        property: 'acceptsStake',
        component: Icon,
        componentProps: {
          icon: Checkmark
        }
      },
      {}
    ]
  }

  const stakeEntries = [
    {
      name: 'RADNODE🔥',
      staking: '75,263.77 XRD',
      stakingValue: 75263.77,
      unstaking: '10,000.10 XRD'
    },
    {
      name: 'XIDAR🏅',
      staking: '8,652,981.36 XRD',
      stakingValue: 8652981.36,
      unstaking: '421.87 XRD'
    },
    {
      name: 'Jazzer 🌍 DefiPlaza',
      staking: '1,124.21 XRD',
      stakingValue: 1124.21,
      unstaking: '2,836.59 XRD'
    },
    {
      name: '🐱 Ocinode',
      staking: '626.38 XRD',
      stakingValue: 626.38,
      unstaking: '0 XRD'
    },
    {
      name: '🐱 Ocinode 🐱 Ocinode 🐱 Ocinode',
      staking: '926.38 XRD',
      stakingValue: 926.38,
      unstaking: '0 XRD'
    }
  ]

  const transactionEntries = [
    {
      id: 'trans...973836',
      date: '6 May / 12:36',
      type: 'transfer',
      withdrawals: '34 XRD',
      deposits: 'None',
      info: 'None'
    },
    {
      id: 'trans...qwer36',
      date: '6 Sep / 12:36',
      type: 'transfer',
      withdrawals: '14 XRD',
      deposits: 'None',
      info: 'None'
    },
    {
      id: 'trans...asd6',
      date: '12 May / 12:36',
      type: 'error',
      withdrawals: '20 XRD',
      deposits: 'None',
      info: 'None'
    }
  ]

  const tableConfig: TableConfig = {
    columns: [
      {},
      {
        label: 'Id/Date (GMT +00)'
      },
      {
        label: 'Type'
      },
      {
        label: 'Withdrawals',
        property: 'withdrawals',
        sortable: true
      },
      {
        label: 'Deposits'
      }
    ]
  }

  const simpleTableConfig: TableConfig<(typeof stakeEntries)[0]> = {
    columns: [
      {
        label: 'Validator',
        property: 'name'
      },
      {
        label: 'Staking',
        property: 'staking',
        sortable: (a: (typeof stakeEntries)[0], b: (typeof stakeEntries)[0]) =>
          a.stakingValue > b.stakingValue ? 1 : -1
      },
      {
        label: 'Unstaking',
        property: 'unstaking',
        sortable: true
      }
    ]
  }
</script>

<Meta title="Table" />

<Story name="Validators Table">
  <Table {entries} {config} />
</Story>

<Story name="Simple Table">
  <Table entries={stakeEntries} config={simpleTableConfig} />
  <Pagination
    disabledNext={true}
    on:next={() => console.log('next')}
    on:previous={() => console.log('previous')}
  />
</Story>

<Story name="Custom Row Table">
  <Table entries={transactionEntries} config={tableConfig}>
    <svelte:fragment slot="row" let:entry let:i>
      <TableRow>
        <ResponsiveTableCell width="80px" />
        <ResponsiveTableCell width="160px" label={tableConfig.columns[1].label}
          >ID: {entry.id}<br />{entry.date}</ResponsiveTableCell
        >

        {#if entry.type === 'error'}
          <td colspan="3"
            ><div class="error-block">
              Transaction error, see transaction details for more information
            </div></td
          >
        {:else}
          <ResponsiveTableCell label={tableConfig.columns[2].label}>
            {entry.type}
          </ResponsiveTableCell>
          <ResponsiveTableCell label={tableConfig.columns[3].label}>
            {entry.withdrawals}
          </ResponsiveTableCell>
          <ResponsiveTableCell label={tableConfig.columns[4].label}>
            {entry.deposits}
          </ResponsiveTableCell>
        {/if}
      </TableRow>
    </svelte:fragment>
  </Table>
</Story>

<style lang="scss">
  .error-block {
    background: rgba(255, 0, 0, 0.1);
    color: red;
    padding: 10px 20px;
    border-radius: var(--border-radius-lg);
  }
</style>
