import type BigNumber from 'bignumber.js';
import type { Direction, Entry, TableColumn } from './types.js';
import { writable, type Writable } from 'svelte/store';

export const sortBasic = <T extends string | number | boolean>(
	a: T,
	b: T,
	direction: Direction
) => {
	if (a === b) {
		return 0;
	}

	return a < b ? (direction === 'ascending' ? -1 : 1) : direction === 'ascending' ? 1 : -1;
};

export const sortBigNumber = (a: BigNumber, b: BigNumber, direction: Direction) => {
	if (a.eq(b)) {
		return 0;
	}

	return a.lt(b) ? (direction === 'ascending' ? -1 : 1) : direction === 'ascending' ? 1 : -1;
};

export const sort =
	<E extends Entry>(column: TableColumn<E>, direction: Direction) =>
	(rows: E[]) => {
		if (!column.sortBy) {
			return rows;
		}

		const defaultSortFn = (a: E, b: E, direction: Direction) => {
			const property = column.sortBy as keyof E;

			if (['string', 'number', 'boolean'].includes(typeof a[property])) {
				return sortBasic(a[property], b[property], direction);
			} else {
				return sortBigNumber(a[property], b[property], direction);
			}
		};

		const sortFn = typeof column.sortBy === 'function' ? column.sortBy : defaultSortFn;

		return [...rows].sort((a, b) => sortFn(a, b, direction));
	};

export const useSorting = <T extends Entry>(
	columns: Readonly<(TableColumn<T> | null)[]>,
	defaultSortedColumn?: string
) => {
	let lastSortedBy: number | undefined = undefined;
	let ascendingSort = false;
	const sortStatus: Writable<('ascending' | 'descending' | 'unsorted')[]> = writable(
		Array(columns.length).fill('unsorted')
	);

	const sortColumn = (column: NonNullable<(typeof columns)[number]>, index: number) => {
		if (lastSortedBy) {
			sortStatus.update((value) => value.map((v, i) => (i === lastSortedBy ? 'unsorted' : v)));
		}

		ascendingSort = index === lastSortedBy ? !ascendingSort : false;

		lastSortedBy = index;
		const direction = ascendingSort ? 'ascending' : 'descending';

		sortStatus.update((value) => value.map((v, i) => (i === index ? direction : v)));

		return sort(column, direction);
	};

	if (defaultSortedColumn) {
		const column = columns.find((c) => c?.id === defaultSortedColumn)!;
		sortColumn(column, columns.indexOf(column));
	}

	return {
		sort: sortColumn,
		sortStatus
	};
};
