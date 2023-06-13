<script lang="ts">
  import Text from '@components/_base/text/Text.svelte'

  export let links: { label: string; href: string }[] = []
</script>

<div id="LinkList">
  {#each links as link}
    <Text color="link" underlined><a href={link.href}>{link.label}</a></Text>
  {/each}
</div>

<style>
  div#LinkList > :global(*:not(:last-child)) {
    padding-bottom: 0.5rem;
  }
</style>
