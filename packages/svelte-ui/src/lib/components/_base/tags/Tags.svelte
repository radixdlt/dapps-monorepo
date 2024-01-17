<script lang="ts">
	import Icon from '@svelte-ui/components/_base/icon/Icon.svelte';
	import NetworkTagIcon from '@icons/network-tag.svg';
	import TagIcon from '@icons/tag.svg';

	export let showNetworkTag = true;
	export let numberOfTags = 0;
	export let tags: string[] = [];
</script>

<div class="tags">
	{#if showNetworkTag}
		<div class="tag network">
			<Icon width="xs" icon={NetworkTagIcon} />
			<span class="tag-text">Radix network</span>
		</div>
	{/if}
	{#each tags as tag}
		<div class="tag other">
			<Icon width="xs" icon={TagIcon} />
			<span class="tag-text">{tag}</span>
		</div>
	{/each}
	{#if numberOfTags > 0}
		<div class="tag other">
			<Icon width="xs" icon={TagIcon} />
			<span class="tag-text">
				+ {numberOfTags}
				{numberOfTags === 1 ? 'tag' : 'tags'}</span
			>
		</div>
	{/if}
</div>

<style lang="scss">
	.tags {
		display: flex;
		flex-wrap: wrap;
		row-gap: var(--spacing-md);
		align-items: center;
	}

	.tag {
		display: flex;
		align-items: center;
		font-size: var(--text-sm);
		border: 1px solid var(--theme-surface-3);
		padding: 0.1rem 0.5rem;
		border-radius: 4px 36px 36px 4px;
		margin-right: var(--spacing-md);

		&:last-child {
			margin-right: 0;
		}
		&.network {
			white-space: nowrap;
		}
		&.other {
			@container (width < 30rem) {
				display: none;
			}
		}

		.tag-text {
			margin-left: var(--spacing-xs);
			text-transform: uppercase;
			color: var(--theme-subtext);
		}
	}
</style>
