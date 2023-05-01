<script lang="ts">
  import Header, { type SortableColumn } from './header/Header.svelte'

  type T = $$Generic
  export let items: (T & Record<SortableColumn, unknown>)[] | undefined =
    undefined
  export let loading: boolean = false

  const sort = (by: keyof T, descending: boolean) => {
    items = items?.sort((a, b) => {
      if (a[by] > b[by]) return descending ? 1 : -1
      if (a[by] < b[by]) return descending ? -1 : 1
      return 0
    })
  }
</script>

<div id="validator-list">
  {#if loading}
    {#each Array(10) as _}
      <slot item={new Promise(() => {})} />
    {/each}
  {:else if items}
    <Header on:sort={(e) => sort(e.detail.by, e.detail.descending)} />
    {#each items as validator}
      <slot item={Promise.resolve(validator)} />
    {/each}
  {/if}
</div>

<style lang="scss">
  @use '../shared.scss';
  #validator-list {
    @include shared.card-list;
  }
</style>
