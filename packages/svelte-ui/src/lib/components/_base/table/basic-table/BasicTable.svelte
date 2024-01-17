<script lang="ts">
	import BasicRow from './BasicRow.svelte';

	import type { TableConfig } from '../types.js';

	import type { BasicTableColumn } from './BasicRow.svelte';

	import ResponsiveTableCell from './ResponsiveTableCell.svelte';
	import TableRow from './TableRow.svelte';
	import type { ComponentProps } from 'svelte';
	import Table from '../Table.svelte';
	import BasicHeader from '../basic-header/BasicHeader.svelte';

	type T = $$Generic<Entry>;

	export let entries: ComponentProps<Table<T>>['entries'];
	export let columns: BasicTableColumn<T>[];
	export let config: TableConfig<T> | undefined = undefined;
	export let defaultSortedColumn: ComponentProps<Table<T>>['defaultSortedColumn'] = undefined;

	interface $$Slots {
		'header-cell': {
			column: BasicTableColumn<T> | null;
			sort: () => void;
			sortStatus: 'ascending' | 'descending' | 'unsorted';
		};
		row: {
			entry: T;
		};
		cell: {
			column: BasicTableColumn<T> | null;
			entry: T;
		};
	}

	const transformProps = (columnConfig: BasicTableColumn<T>, entry: T) => {
		if (!columnConfig.componentProps) {
			return {};
		}

		return Object.entries(columnConfig.componentProps).reduce((acc, [key, value]) => {
			if (typeof value === 'string' && value.startsWith('$$')) {
				acc[key] = entry[value.slice(2)];
			} else if (typeof value === 'function') {
				acc[key] = value(entry);
			} else {
				acc[key] = value;
			}
			return acc;
		}, {} as Record<string, string | number | boolean | Record<string, any>>);
	};
</script>

<div class="basic-table">
	<Table {config} {entries} {columns} {defaultSortedColumn}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->

		<slot
			name="header-cell"
			slot="header-cell"
			let:column
			let:sort
			let:sortStatus
			{column}
			{sort}
			{sortStatus}
		>
			<BasicHeader
				on:click={sort}
				alignment={column?.alignment}
				sorting={column?.sortBy ? sortStatus : undefined}
			>
				{#if column?.header?.label}
					{column.header.label}
				{/if}
			</BasicHeader>
		</slot>

		<svelte:fragment slot="empty-row" let:entry>
			<slot name="row" {entry}>
				<BasicRow {columns} {config} {entry} />
			</slot>
		</svelte:fragment>

		<slot name="row" slot="row" let:entry {entry}>
			<BasicRow {columns} {config} {entry} />
		</slot>
	</Table>
</div>

<style lang="scss">
	@use '../shared.scss';

	.cell-text {
		font-weight: var(--font-weight-bold-2);

		@include mixins.desktop {
			font-weight: var(--font-weight-bold-1);
		}
	}

	.basic-table {
		:global(table) {
			border-collapse: separate;
			@include mixins.desktop {
				border-spacing: 0 shared.$row-spacing;
			}

			width: 100%;
		}
	}

	.basic-table :global(thead) :global(th) {
		&:first-child {
			padding-left: var(--spacing-xl);
		}
		&:last-child {
			padding-right: var(--spacing-xl);
		}
	}
</style>
