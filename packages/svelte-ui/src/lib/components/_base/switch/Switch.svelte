<script lang="ts">
	export let on = false;
	export let width = '30px';
</script>

<label class="switch" style:--width={width}>
	<input type="checkbox" bind:checked={on} />
	<span class="slider" />
</label>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: var(--width);
		height: calc(var(--width) * 0.7);
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: 0.4s;
		border-radius: 34px;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: calc(var(--width) * 0.6);
		width: calc(var(--width) * 0.6);
		left: calc(var(--width) * 0.04);
		bottom: calc(var(--width) * 0.05);
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
	}

	input:checked + .slider {
		background-color: var(--color-grey-1);
	}

	input:checked + .slider:before {
		transform: translateX(calc(var(--width) * 0.31));
	}
</style>
