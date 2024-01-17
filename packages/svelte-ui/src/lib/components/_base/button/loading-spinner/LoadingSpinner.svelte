<script lang="ts">
	import { css, keyframes } from '../styles.js';

	const animation = keyframes({
		'0%': {
			transform: 'rotate(0deg)'
		},
		'100%': {
			transform: 'rotate(360deg)'
		}
	});

	const loader = css({
		width: '100%',
		aspectRatio: '1 / 1',
		border: '3px solid #fff',
		borderBottomColor: '$muted',
		borderRadius: '50%',
		display: 'inline-block',
		boxSizing: 'border-box',
		animation: `${animation} 1s linear infinite`
	})();
</script>

<div class={loader} />
