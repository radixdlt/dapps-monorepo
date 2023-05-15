<script lang="ts">
  import type { Validator } from '../Validators.svelte'
  import StakedValidatorCard from '../validator-card/staked-validator-card/StakedValidatorCard.svelte'
  import ValidatorListCard from '../validator-card/validator-list-card/ValidatorListCard.svelte'
  import Header from './header/Header.svelte'

  export let type: 'all' | 'staked'
  export let items: Validator[]
  export let loading: boolean = false

  const sort = (by: keyof Validator, descending: boolean) => {
    items = items?.sort((a, b) => {
      if (a[by] > b[by]) return descending ? 1 : -1
      if (a[by] < b[by]) return descending ? -1 : 1
      return 0
    })
  }
</script>

<div id="validator-list">
  {#if loading}
    {#each Array(10) as _, i}
      {#if type === 'all'}
        <ValidatorListCard validatorInfo={new Promise(() => {})} />
      {:else if type === 'staked'}
        <StakedValidatorCard validatorInfo={new Promise(() => {})} />
      {/if}
      <slot item={new Promise(() => {})} />
    {/each}
  {:else if items}
    <Header on:sort={(e) => sort(e.detail.by, e.detail.descending)} />
    {#if type === 'all'}
      {#each items as validator}
        <ValidatorListCard
          validatorInfo={Promise.resolve(validator)}
          on:click-validator
        />
      {/each}
    {/if}
    {#if type === 'staked'}
      {#each items as validator}
        <StakedValidatorCard
          validatorInfo={Promise.resolve(validator)}
          on:click-validator
        />
      {/each}
    {/if}
  {/if}
</div>

<style lang="scss">
  @use '../shared.scss';
  #validator-list {
    @include shared.card-list;
  }
</style>
