<script lang="ts">
	import { RadixNetwork } from '../../../../../common/src/utils/gateway-sdk.js';
	import '@radixdlt/dapps-dropdown';

	export let currentNetworkId: number;

	const networkName = currentNetworkId === RadixNetwork.Mainnet ? 'Mainnet' : 'Stokenet';
</script>

<radix-dapps-dropdown {networkName} />
