<script>
  import Icon from '@components/_base/icon/Icon.svelte'
  import NetworkTagIcon from '@icons/network-tag.svg'
  import TagIcon from '@icons/tag.svg'

  export let showNetworkTag = true
  export let numberOfTags = 0
</script>

<div class="tags">
  {#if showNetworkTag}
    <div class="tag network">
      <Icon width="xs" icon={NetworkTagIcon} />
      <span class="tag-text">Radix network</span>
    </div>
  {/if}
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
    align-items: center;
    margin-top: var(--spacing-xs);
  }

  .tag {
    display: flex;
    align-items: center;
    font-size: var(--text-sm);
    &.network {
      margin-right: var(--spacing-md);
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
      color: var(--color-grey-2);
    }
  }
</style>
