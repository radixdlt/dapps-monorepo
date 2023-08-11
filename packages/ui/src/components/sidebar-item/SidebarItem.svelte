<script lang="ts">
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import { showSidebar } from '@stores'

  export let isActive = false
  export let icon: string
  export let isHovered = isActive
  export let link: string
</script>

<a
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  class="item"
  class:is-hovered={isHovered || isActive}
  href={link}
  on:click={() => {
    showSidebar.set(false)
  }}
>
  <IconTextItem iconSize="xs" bold={isHovered || isActive} {icon}
    ><slot /></IconTextItem
  >
</a>

<style lang="scss">
  .is-hovered {
    background: var(--color-grey-4);
    transition: all ease-in-out 0.2s;
    border-radius: var(--border-radius-lg);
    :global(img) {
      filter: grayscale(0);
    }
  }

  .item {
    cursor: pointer;
    height: 3rem;
    display: flex;
    align-items: center;
    margin: 0 var(--spacing-md);
    padding: 0 var(--spacing-md);
  }
</style>
