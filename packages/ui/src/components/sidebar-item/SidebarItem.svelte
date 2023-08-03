<script lang="ts">
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import { showSidebar } from '@stores'

  export let isActive = false
  export let icon: string
  export let isHovered = isActive
  export let link: string
</script>

<div
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  class="item"
  class:is-hovered={isHovered || isActive}
>
  <a
    href={link}
    on:click={() => {
      showSidebar.set(false)
    }}
    ><IconTextItem bold={isHovered || isActive} {icon}><slot /></IconTextItem
    ></a
  >
</div>

<style lang="scss">
  .is-hovered {
    border-left-width: 5px !important;
    border-left-color: var(--color-grey-1) !important;

    :global(img) {
      filter: grayscale(0);
      transition: all ease-in-out 0.5s;
    }
  }

  .item {
    border-style: solid;
    border-width: 0;
    border-left-width: 5px;
    border-left-color: transparent;
    border-radius: 0;
    cursor: pointer;
    height: 2.5rem;
    display: flex;
    align-items: center;

    a {
      margin: 0 var(--spacing-md);
    }
  }
</style>
