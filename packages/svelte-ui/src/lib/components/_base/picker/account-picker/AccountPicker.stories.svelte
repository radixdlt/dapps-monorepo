<script context="module">
	export const meta = {};
</script>

<script lang="ts">
	import { Story } from '@storybook/addon-svelte-csf';
	import AccountPicker from './AccountPicker.svelte';
</script>

<Story name="Primary">
	<div style="background: #F4F5F9; height:100vh;padding:40px">
		<div style="width:400px">
			<AccountPicker />
		</div>
	</div>
</Story>
