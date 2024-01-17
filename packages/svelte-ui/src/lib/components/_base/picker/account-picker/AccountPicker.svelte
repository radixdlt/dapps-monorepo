<script lang="ts">
	import Account from '@svelte-ui/components/_base/account/Account.svelte';
	import Picker from '../Picker.svelte';
	import AccountPickerExpandIcon from '@icons/account-picker-expand.svg';
	import { accounts, type Account as AccountType } from '@svelte-ui/stores';
	import IconNew from '@svelte-ui/components/_base/icon/IconNew.svelte';

	export let selected: AccountType;

	$: options = $accounts.map((account) => ({
		label: account.label,
		value: account
	}));
</script>

<Picker
	{options}
	selectionText="Select Account"
	on:selected={(e) => {
		selected = e.detail.value;
	}}
>
	<svelte:fragment slot="selected" let:open let:selected>
		<Account account={selected.value}>
			<div class="icon" style:transform={`rotate(${open ? '-180deg' : 0})`}>
				<IconNew icon={AccountPickerExpandIcon} size="small" />
			</div>
		</Account>
	</svelte:fragment>

	<svelte:fragment slot="option" let:option>
		<Account account={option.value} />
	</svelte:fragment>
</Picker>

<style>
	.icon {
		transition: transform 0.3s ease;
	}
</style>
