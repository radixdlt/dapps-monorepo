<script context="module">
	export const meta = {};
</script>

<script lang="ts">
	import { Story } from '@storybook/addon-svelte-csf';
	import Table from '../Table.svelte';
	import Address from '../../address/Address.svelte';
	import { formatTokenValue } from '../../../../utils';
	import Pagination from './Pagination.svelte';
	import TableRow from './TableRow.svelte';
	import Checkmark from '@icons/checkmark.svg';
	import ResponsiveTableCell from './ResponsiveTableCell.svelte';
	import BigNumber from 'bignumber.js';
	import Icon from '../../icon/Icon.svelte';
	import type { ComponentProps } from 'svelte';
	import BasicTable from './BasicTable.svelte';

	const validatorAddresses = [
		'validator_1234567890',
		'validator_1234567891',
		'validator_1234567892',
		'validator_1234567893'
	];

	const validatorNames = ['RADNODE🔥', 'XIDAR🏅', 'Jazzer 🌍 DefiPlaza', '🐱 Ocinode'];

	const validator = (i: number) => ({
		name: validatorNames[i % 4],
		address: validatorAddresses[i % 4],
		totalStake: new BigNumber(Math.floor(Math.random() * 300000)),
		percentageOwnerStake: new BigNumber((Math.random() * 30).toFixed(2)),
		apy: new BigNumber((Math.random() * 30).toFixed(2)),
		fee: new BigNumber((Math.random() * 15).toFixed(2)),
		uptime: `${new BigNumber(Math.floor(Math.random() * 100))} %`,
		acceptsStake: Math.random() > 0.5 ? true : false,
		ownerStake: new BigNumber((Math.random() * 50).toFixed(2))
	});

	const entries = Array(6)
		.fill(undefined)
		.map((_, i) => validator(i));

	const columns: ComponentProps<BasicTable<(typeof entries)[number]>>['columns'] = [
		{
			header: {
				label: 'Validator'
			},
			renderAs: ({ name }) => name
		},
		{
			header: {
				label: 'Address'
			},
			id: 'address'
		},
		{
			header: {
				label: 'Total Stake'
			},
			renderAs: ({ totalStake }) => formatTokenValue(totalStake).displayValue,
			sortBy: 'totalStake'
		},
		{
			header: {
				label: 'Owner Stake (%)'
			},
			renderAs: ({ ownerStake }) => `${ownerStake} %`,
			sortBy: 'ownerStake'
		},
		{
			header: {
				label: 'APY'
			},
			renderAs: ({ apy }) => `${apy} %`,
			sortBy: 'apy'
		},
		{
			header: {
				label: 'Fee'
			},
			sortBy: 'fee',
			renderAs: ({ fee }) => `${fee} %`
		},
		{
			header: {
				label: 'Uptime'
			},
			renderAs: ({ uptime }) => uptime,
			sortBy: 'uptime'
		},
		{
			header: {
				label: 'Accepts stake'
			},
			renderAs: ({ acceptsStake }) => (acceptsStake ? 'Yes' : 'No'),
			sortBy: 'acceptsStake'
		},
		null
	];

	const columnsWithComponents: ComponentProps<BasicTable<ReturnType<typeof validator>>>['columns'] =
		[
			{
				header: {
					label: 'Accepts stake'
				},
				component: Icon,
				componentProps: {
					icon: Checkmark
				}
			},
			null
		];

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
	];

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
	];

	const tableColumns: ComponentProps<BasicTable<(typeof transactionEntries)[number]>>['columns'] = [
		null,
		{
			header: {
				label: 'Id/Date (GMT +00)'
			}
		},
		{
			header: {
				label: 'Type'
			}
		},
		{
			header: {
				label: 'Withdrawals'
			},
			sortBy: 'withdrawals'
		},
		{
			header: {
				label: 'Deposits'
			}
		}
	];

	const simpleTableColumns: ComponentProps<BasicTable<(typeof stakeEntries)[number]>>['columns'] = [
		{
			header: {
				label: 'Validator'
			},
			renderAs: ({ name }) => name
		},
		{
			header: {
				label: 'Staking'
			},
			renderAs: ({ staking }) => staking,
			sortBy: (a: (typeof stakeEntries)[0], b: (typeof stakeEntries)[0]) =>
				a.stakingValue > b.stakingValue ? 1 : -1
		},
		{
			header: {
				label: 'Unstaking'
			},
			renderAs: ({ unstaking }) => unstaking,
			sortBy: 'unstaking'
		}
	];
</script>

<Story name="Validators Table">
	<BasicTable {entries} {columns}>
		<svelte:fragment slot="cell" let:column let:entry>
			{#if column}
				{#if column.id === 'address'}
					<Address short value={entry.address} />
				{:else if column.renderAs}
					{column.renderAs(entry)}
				{/if}
			{/if}
		</svelte:fragment>
	</BasicTable>
</Story>

<Story name="With Component API">
	<BasicTable {entries} columns={columnsWithComponents} />
</Story>

<Story name="Simple Table">
	<BasicTable entries={stakeEntries} columns={simpleTableColumns} />
	<Pagination
		disabledNext={true}
		on:next={() => console.log('next')}
		on:previous={() => console.log('previous')}
	/>
</Story>

<Story name="Custom Row Table">
	<Table entries={transactionEntries} columns={tableColumns}>
		<svelte:fragment slot="row" let:entry>
			<TableRow>
				<ResponsiveTableCell width="80px" />
				<ResponsiveTableCell width="160px" label={tableColumns[1]?.header?.label}
					>ID: {entry.id}<br />{entry.date}</ResponsiveTableCell
				>

				{#if entry.type === 'error'}
					<ResponsiveTableCell colspan={3}
						><div class="error-block">
							Transaction error, see transaction details for more information
						</div></ResponsiveTableCell
					>
				{:else}
					<ResponsiveTableCell label={tableColumns[2]?.header?.label}>
						{entry.type}
					</ResponsiveTableCell>
					<ResponsiveTableCell label={tableColumns[3]?.header?.label}>
						{entry.withdrawals}
					</ResponsiveTableCell>
					<ResponsiveTableCell label={tableColumns[4]?.header?.label}>
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
