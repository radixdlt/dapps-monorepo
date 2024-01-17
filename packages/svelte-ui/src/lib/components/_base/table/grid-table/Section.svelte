<script lang="ts">
	type IDs = $$Generic<string[]>;
	type ColumnIdentifier = $$Generic<number | IDs[number]>;

	export let columnIds: Readonly<IDs>;
	export let renderAt:
		| (ColumnIdentifier | { start: ColumnIdentifier; end: ColumnIdentifier })
		| undefined = undefined;

	const getIndexOfColumn = (column: ColumnIdentifier) =>
		typeof column === 'number' ? column : columnIds.indexOf(column);

	let start: number;

	$: {
		columnIds;
		start = renderAt
			? getIndexOfColumn(typeof renderAt === 'object' ? renderAt.start : renderAt)
			: 0;
	}

	$: end = renderAt
		? getIndexOfColumn(typeof renderAt === 'object' ? renderAt.end : renderAt)
		: columnIds.length;

	$: subColumns = columnIds.slice(start, end);
</script>

<div class="section" style:grid-column="{start + 1} / {end + 2}">
	<slot columnIds={subColumns} />
</div>

<style>
	.section {
		display: grid;
		grid-template-columns: subgrid;
	}
</style>
