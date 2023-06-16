<script lang="ts">
  import Pill from './Pill.svelte'
  export let active: string | undefined
  export let items: { id: string; label: string }[][] = []
  export let onClick = (id: string) => {}
</script>

<div class="menu">
  {#each items as itemGroup, index}
    {#if index > 0}
      <div class="divider" />
    {/if}
    {#each itemGroup as item, itemIndex}
      <Pill
        --pill-margin-right={itemGroup.length - 1 === itemIndex ? '' : '1rem'}
        active={item.id === active}
        on:click={() => {
          active = item.id
          onClick(item.id)
        }}>{item.label}</Pill
      >
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
  }

  .menu::-webkit-scrollbar {
    display: none;
  }
  .divider {
    background: var(--border);
    width: 1px;
    height: 2rem;
    margin: 0 2rem;
  }
</style>
