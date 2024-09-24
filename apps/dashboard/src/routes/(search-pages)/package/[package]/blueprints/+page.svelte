<script lang="ts">
  import Row from '@components/info-box/Row.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#await data.promises.package then _package}
  {#each _package.blueprints as blueprint}
    <div class="card">
      <h3>{blueprint.name}</h3>
      {#each blueprint.methods as method}
        <Row modifiers="no-capitalize" text={method.name} />
      {/each}
    </div>
  {/each}
{/await}

<style lang="scss">
  .card:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
