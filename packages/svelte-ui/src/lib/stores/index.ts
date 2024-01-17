import { derived, writable } from 'svelte/store';
import { writable as localStorageStore } from 'svelte-local-storage-store';
import type { NetworkConfigurationResponse } from '../../../../common/src/utils/gateway-sdk.js';
import type { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit';

export type Account = {
	label: string;
	address: string;
	displayed: string;
	appearanceId?: number;
};

export const accounts = writable<Account[]>([]);

export const selectedAccount = writable<Account | undefined>(undefined);

export const connected = derived([accounts], ([accounts]) => accounts.length > 0);

export const storage = localStorageStore('storage', { theme: 'light' });

export const networkConfiguration = writable<NetworkConfigurationResponse | undefined>();

export const xrdAddress = derived(networkConfiguration, (config) =>
	config?.well_known_addresses ? config.well_known_addresses['xrd'] : undefined
);

export const externalNavigationConfirmation = writable<
	| {
			confirm: (value: boolean) => void;
			url: string;
	  }
	| undefined
>(undefined);

export const dAppToolkit = writable<RadixDappToolkit | undefined>(undefined);
