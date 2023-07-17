<script lang="ts">
  import type { Validator } from '../Validators.svelte'
  import StakedValidatorCard from '../validator-card/staked-validator-card/StakedValidatorCard.svelte'
  import ValidatorListCard from '../validator-card/validator-list-card/ValidatorListCard.svelte'
  import Header from './header/Header.svelte'

  export let type: 'all' | 'staked'
  export let validators: Promise<Validator[]>

  const sort = (by: keyof Validator, descending: boolean) => {
    validators = validators.then((v) =>
      v.sort((a, b) => {
        if (a[by] > b[by]) return descending ? 1 : -1
        if (a[by] < b[by]) return descending ? -1 : 1
        return 0
      })
    )
  }
</script>

<div class="card-list">
  {#await validators}
    {#each Array(10) as _, i}
      {#if type === 'all'}
        <ValidatorListCard validatorInfo={new Promise(() => {})} />
      {:else if type === 'staked'}
        <StakedValidatorCard validatorInfo={new Promise(() => {})} />
      {/if}
      <slot item={new Promise(() => {})} />
    {/each}
  {:then validators}
    {#if validators.length > 0}
      <Header on:sort={(e) => sort(e.detail.by, e.detail.descending)} />
      {#if type === 'all'}
        {#each validators as validator}
          <ValidatorListCard
            validatorInfo={Promise.resolve(validator)}
            on:click-validator
          />
        {/each}
      {/if}
      {#if type === 'staked'}
        {#each validators as validator}
          <StakedValidatorCard
            validatorInfo={Promise.resolve(validator)}
            on:click-validator
          />
        {/each}
      {/if}
    {/if}
  {/await}
</div>

<style lang="scss">
  @use '../shared.scss';
</style>
