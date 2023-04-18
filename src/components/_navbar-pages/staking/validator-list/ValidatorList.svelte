<script lang="ts">
  import type { Validator } from '../Validators.svelte'
  import ValidatorListCard from '../validator-card/validator-list-card/ValidatorListCard.svelte'

  export let validators: Promise<Validator[]>
</script>

<div id="validator-list">
  {#await validators}
    {#each Array(10) as _}
      <ValidatorListCard validatorInfo={new Promise(() => {})} />
    {/each}
  {:then validators}
    {#each validators as validator}
      <ValidatorListCard validatorInfo={Promise.resolve(validator)} />
    {/each}
  {/await}
</div>

<style>
  #validator-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
