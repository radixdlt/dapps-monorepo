<script lang="ts">
  import { onMount } from 'svelte'
  import Pill from './Pill.svelte'
  export let active: string | undefined
  export let items: {
    id: string
    label: string
    disabled?: Promise<boolean>
  }[][] = []
  export let onClick = (id: string) => {}
  export let scrollIntoView = true

  let pills: Record<string, HTMLElement> = {}

  onMount(() => {
    if (active && scrollIntoView) {
      pills[active]?.scrollIntoView({ block: 'center' })
    }
  })
</script>

<div class="menu">
  {#each items as itemGroup, index}
    {#if index > 0}
      <div class="divider" />
    {/if}
    {#each itemGroup as item, itemIndex}
      <div bind:this={pills[item.id]}>
        <Pill
          --pill-margin-right={itemGroup.length - 1 === itemIndex ? '' : '1rem'}
          active={item.id === active}
          disabled={item.disabled}
          on:click={() => {
            active = item.id
            onClick(item.id)
          }}>{item.label}</Pill
        >
      </div>
    {/each}
  {/each}
</div>

<style lang="scss">
  .menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow: auto;
    margin: var(--margin, 0);
  }

  .menu::-webkit-scrollbar {
    display: none;
  }
  .divider {
    background: var(--border);
    width: 1px;
    min-width: 1px;
    height: 2rem;
    margin: 0 2rem;

    @include mixins.mobile {
      margin: 0 0.75rem;
    }
  }
</style>
