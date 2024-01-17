<script lang="ts">
	import { useSorting } from '../sorting.js';
	import type { TableColumn } from '../types.js';
	import Section from './Section.svelte';
	import type { Entry } from '../types.js';

	type T = $$Generic<Entry>;

	export let columns: Readonly<(TableColumn<T> & { id: NonNullable<TableColumn<T>['id']> })[]>;
	export let defaultSortedColumn: NonNullable<(typeof columns)[number]>['id'] | undefined =
		undefined;

	const { sort, sortStatus } = useSorting(columns, defaultSortedColumn);
</script>

<div class="grid-table" style:grid-template-columns="repeat({columns.length}, auto)">
	{#each columns as column, i}
		<div
			class="header"
			style:grid-column={i + 1}
			class:left-aligned={column.header?.alignment === 'left'}
			class:right-aligned={column.header?.alignment === 'right'}
		>
			<slot
				name="header-cell"
				{column}
				sort={sort.bind(null, column, i)}
				sortStatus={$sortStatus[i]}
			/>
		</div>
	{/each}

	<slot name="rows" {Section} />
</div>

<style lang="scss">
	.grid-table {
		display: grid;
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 3rem;
	}

	.left-aligned {
		justify-content: flex-start;
	}

	.right-aligned {
		justify-content: flex-end;
	}
</style>
