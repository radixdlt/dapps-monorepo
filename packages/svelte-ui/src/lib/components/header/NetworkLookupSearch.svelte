<script lang="ts">
	import { goto } from '$app/navigation';
	import Search from '../_base/search/Search.svelte';
	import { addressToRoute } from '../../../../../../apps/dashboard/src/utils.js';

	const search = async (address: string) => goto(await addressToRoute(address));
</script>

<Search
	onSearch={search}
	placeholder="Search for a transaction ID, or an address for an account, or a resource"
/>
