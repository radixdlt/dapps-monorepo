<script lang="ts" context="module">
	import { Template, Story } from '@storybook/addon-svelte-csf';
	import Address from './Address.svelte';

	export const meta = {};
</script>

<Template let:args>
	<Address
		short={args.short}
		autoShorten={args.autoShorten}
		value={'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe'}
	/>
</Template>

<Story name="Long" args={{ short: false }} />

<Story name="Short" args={{ short: true }} />

<Story name="Responsive" args={{ autoShorten: true }} />
