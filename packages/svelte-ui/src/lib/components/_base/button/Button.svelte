<script lang="ts">
	import type { CSS } from '@stitches/core';

	import { css, config } from './styles.js';
	import LoadingSpinner from './loading-spinner/LoadingSpinner.svelte';

	const variants = {
		connected: {
			true: {
				background: "url('/images/bg-connect-button.png') no-repeat",
				backgroundSize: 'cover',
				backgroundColor: '$connectButton'
			}
		},
		selectedAccountButton: {
			true: {
				border: '2px solid $connectButton',
				background:
					'linear-gradient(90deg, hsla(221.967, 94%, 38%, 1) 0%, hsla(197.341, 95%, 36%, 1) 49%, hsla(163.434, 96%, 44%, 1) 100%)'
			}
		},
		accountButton: {
			true: {
				height: '42px',
				borderRadius: '$lg',
				justifyContent: 'space-between'
			}
		},
		connectButton: {
			true: {
				width: '$3xl',
				height: '42px',
				borderRadius: '$lg',
				backgroundColor: '$connectButton'
			}
		},
		full: {
			true: {
				width: '$1'
			}
		},
		size: {
			medium: {
				height: '$lg',
				width: '$3xl',
				fontSize: '$md'
			},
			small: {
				height: '$md',
				width: '$2xl',
				fontSize: '$sm'
			},
			iconSmall: {
				height: '$sm',
				width: '$xl',
				fontSize: '0'
			}
		},
		border: {
			none: {
				borderWidth: '0'
			}
		},
		active: {
			true: {
				backgroundColor: '$primary',
				color: '$primaryButtonText',
				'&:hover': {
					backgroundColor: '$primary'
				}
			}
		},
		ghost: {
			true: {
				backgroundColor: '$primaryGhostButton',
				color: '$primaryGhostButtonText',
				'&:hover': {
					backgroundColor: '$primaryGhostButtonHover',
					color: '$primaryGhostButtonHoverText'
				}
			}
		}
	};

	export let cx: CSS<typeof config> = {};
	export let full: true | false = false;
	export let size: keyof (typeof variants)['size'] | undefined = 'medium';
	export let border: keyof (typeof variants)['border'] | undefined = undefined;
	export let ghost: true | false = false;
	export let disabled: true | false = false;
	export let active: true | false = false;
	export let connectButton: true | false = false;
	export let accountButton: true | false = false;
	export let selectedAccountButton: true | false = false;
	export let connected: true | false = false;
	export let loading = false;

	const btn = css({
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '$primaryButton',
		borderWidth: '$sm',
		borderColor: '$borderColor',
		borderStyle: 'solid',
		cursor: 'pointer',
		borderRadius: '$sm',
		fontSize: '$md',
		color: '$primaryButtonText',
		transition: 'color .2s,border-color .2s,background-color .2s',
		'&:hover': {
			backgroundColor: '$primaryButtonHover'
		},
		variants,
		...cx
	});

	const btnClass = btn({
		active,
		full,
		size,
		border,
		ghost,
		connectButton,
		connected,
		accountButton,
		selectedAccountButton
	});
	const disabledClass = css({
		backgroundColor: '$primaryButtonDisabled',
		color: '$grey',
		cursor: 'not-allowed',
		'&:hover': {
			backgroundColor: '$primaryButtonDisabled'
		}
	})();
	const disabledBtnClass = `${btnClass} ${disabledClass}`;
</script>

<button {...$$restProps} {disabled} on:click class={disabled ? disabledBtnClass : btnClass}>
	{#if loading}
		<div style:height="60%" style:aspect-ratio="1/1">
			<LoadingSpinner />
		</div>
	{:else}
		<slot />
	{/if}
</button>
