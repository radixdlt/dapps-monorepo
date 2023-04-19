<script lang="ts">
  import Header from './Header.svelte'
  import type { Validator } from '../Validators.svelte'
  import ValidatorListCard from '../validator-card/validator-list-card/ValidatorListCard.svelte'

  export let validators: Promise<Validator[]>

  let lastSortedBy: keyof Validator
  let reverse = false

  const sort = (by: keyof Validator) => {
    if (lastSortedBy === by) reverse = !reverse

    lastSortedBy = by

    validators = validators.then((validators) =>
      validators.sort((a, b) => {
        if (a[by] > b[by]) return reverse ? 1 : -1
        if (a[by] < b[by]) return reverse ? -1 : 1
        return 0
      })
    )
  }
</script>

<div id="validator-list">
  {#await validators}
    {#each Array(10) as _}
      <ValidatorListCard validatorInfo={new Promise(() => {})} />
    {/each}
  {:then validators}
    <Header
      on:sort-total-stake={() => sort('totalStake')}
      on:sort-owner-stake={() => sort('percentageOwnerStake')}
      on:sort-apy={() => sort('apy')}
      on:sort-fee={() => sort('fee')}
      on:sort-uptime={() => sort('uptime')}
    />
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
