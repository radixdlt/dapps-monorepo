export const configs = {
	flags: {
		isVitebook: process.env.VITEBOOK === 'true'
	},
	url: {
		MAINNET_URL: 'https://mainnet-gateway.radixdlt.com'
	},
	alias: {
		'@components': 'src/components',
		'@styles': 'src/styles.ts',
		'@types': 'src/types.ts',
		'@sdk': 'src/mock-sdk.ts',
		'@stores': 'src/stores.ts',
		'@utils': 'src/utils/utils.ts',
		'@configs': 'configs.js'
	}
}
