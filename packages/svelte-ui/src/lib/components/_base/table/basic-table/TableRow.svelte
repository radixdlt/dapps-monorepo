<script lang="ts">
	export let customClass = '';
</script>

<tr class="card table-row {customClass}" on:click>
	<slot />
</tr>

<style lang="scss">
	.table-row {
		&.card {
			padding: 0;
		}

		&.clickable {
			cursor: pointer;
		}

		&:hover {
			box-shadow: var(--shadow-hover);
		}

		transition: var(--transition-hover-card);
		height: 4rem;
		background: none;

		@include mixins.mobile {
			height: auto;
			display: flex;
			flex-direction: column;
			&:not(:last-child) {
				margin-bottom: 25px;
			}
		}

		:global(td) {
			border: var(--border) var(--theme-border);
			background: var(--theme-surface-2);

			@include mixins.mobile {
				border: none;
				border-bottom: 1px solid var(--color-grey-4);
				border-top: none;
				padding: 16px 24px;

				&:last-child {
					border-bottom: none;
				}
			}

			@include mixins.desktop {
				margin: 10px 0;
				padding: var(--table-row-cell-vertical-padding, 10px)
					var(--table-row-cell-horizontal-padding, 10px);

				&:not(:first-child) {
					border-left: none;
				}

				&:not(:last-child) {
					border-right: none;
				}

				&:first-child {
					border-top-left-radius: var(--border-radius-lg);
					border-bottom-left-radius: var(--border-radius-lg);
					padding-left: var(--spacing-xl);
				}

				&:last-child {
					border-top-right-radius: var(--border-radius-lg);
					border-bottom-right-radius: var(--border-radius-lg);
					padding-right: var(--spacing-xl);
				}
			}
		}
	}
</style>
