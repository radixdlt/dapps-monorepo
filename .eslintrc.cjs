module.exports = {
	extends: '@sveltejs',
	rules: {
		semi: [ 0, 'never' ]
	},
	settings: {
		'svelte3/typescript': require('typescript')
	}
};
