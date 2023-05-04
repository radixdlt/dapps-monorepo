<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Validator } from '../Validators.svelte'
  import StakedValidatorCard from '../validator-card/staked-validator-card/StakedValidatorCard.svelte'
  import ValidatorListCard from '../validator-card/validator-list-card/ValidatorListCard.svelte'
  import Header from './header/Header.svelte'

  type AllInput = {
    type: 'all'
    items: Validator[]
  }

  type StakedInput = {
    type: 'staked'
    items:
      | (Validator & {
          validator: string
          staked: number
          unstaking: number
          readyToClaim: number
        })[]
      | undefined
  }

  export let input: AllInput | StakedInput
  export let loading: boolean = false

  const sort = (by: keyof Validator, descending: boolean) => {
    input.items = input.items?.sort((a, b) => {
      if (a[by] > b[by]) return descending ? 1 : -1
      if (a[by] < b[by]) return descending ? -1 : 1
      return 0
    })
  }

  let selected: Validator[] = []

  const dispatch = createEventDispatcher<{ selected: Validator[] }>()

  const handleSelect = (e: CustomEvent<Validator>) => {
    selected = [...selected, e.detail]
    dispatch('selected', selected)
  }

  const handleUnselect = (e: CustomEvent<Validator>) => {
    selected = selected.filter((v) => v.address !== e.detail.address)
    dispatch('selected', selected)
  }
</script>

<div id="validator-list">
  {#if loading}
    {#each Array(10) as _}
      {#if input.type === 'all'}
        <ValidatorListCard validatorInfo={new Promise(() => {})} />
      {:else if input.type === 'staked'}
        <StakedValidatorCard
          validatorInfo={new Promise(() => {})}
          stakingInfo={new Promise(() => {})}
        />
      {/if}
      <slot item={new Promise(() => {})} />
    {/each}
  {:else if input.items}
    <Header on:sort={(e) => sort(e.detail.by, e.detail.descending)} />
    {#if input.type === 'all'}
      {#each input.items as validator}
        <ValidatorListCard
          validatorInfo={Promise.resolve(validator)}
          on:selected={handleSelect}
          on:unselected={handleUnselect}
        />
      {/each}
    {/if}
    {#if input.type === 'staked'}
      {#each input.items as validator}
        <StakedValidatorCard
          validatorInfo={Promise.resolve(validator)}
          stakingInfo={Promise.resolve(validator)}
          on:selected={handleSelect}
          on:unselected={handleUnselect}
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
