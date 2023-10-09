<script lang="ts">
  import Link from './Link.svelte'

  export let links: {
    url: string
    text?: string
  }[] = []

  export let external = false
</script>

{#if links.length > 0}
  <div class="links-list">
    {#each links as value}
      <Link url={value.url} text={value.text} {external} />
    {/each}
  </div>
{/if}

<style lang="scss">
  .links-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    :global(.link:not(:first-child)) {
      margin-top: 0.5rem;
    }

    @include mixins.desktop {
      align-items: flex-end;
    }
  }
</style>
