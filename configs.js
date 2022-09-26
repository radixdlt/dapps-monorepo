export const configs = {
	flags: {
		isVitebook: process.env.VITEBOOK === 'true'
	},
	alias: {
		'@components': 'src/components',
		'@styles': 'src/styles.ts',
		'@types': 'src/types.ts',
		'@sdk': 'src/mock-sdk.ts',
		'@stores': 'src/stores.ts',
		'@utils': 'src/utils/utils.ts',
		'@constants': 'src/constants.ts',
		'@gateway': 'src/gateway.ts',
		'@configs': 'configs.js',
		'@io': 'src/io',
		'@wallet': 'src/wallet',
	}
}
