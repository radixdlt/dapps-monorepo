<script lang="ts">
	export let selected = false;
</script>

<div class="radio-wrapper">
	<div class="radio {selected ? 'selected' : ''}" />
</div>

<style lang="scss">
	.radio-wrapper {
		position: relative;
		display: inline-block;
	}
	.radio {
		width: 1rem;
		height: 1rem;
		&::before {
			content: ' ';
			position: absolute;
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: rgba(244, 245, 259, 0.4);
			border: 1px solid white;
		}

		&.selected {
			&::before {
				background: white;
			}

			&::after {
				content: ' ';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				border-radius: 50%;
				width: 0.5rem;
				height: 0.5rem;
				background: #003057;
			}
		}
	}
</style>
