<script lang="ts">
  import InputNew from '@components/_base/input/InputNew.svelte'
  import FilterCard from './FilterCard.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import { shortenAddress } from '@utils'

  export let title: string
  export let description: string
  export let values: string[]

  let input = ''
</script>

<FilterCard {title} {description} appliedFilters={values.map(shortenAddress)}>
  <div class="input">
    <div class="textinput">
      <InputNew border bind:value={input} />
    </div>

    <div class="button">
      <ButtonNew
        on:click={() => {
          values = [...values, input]
          input = ''
        }}>Add</ButtonNew
      >
    </div>

    <div class="button">
      <ButtonNew
        on:click={() => {
          values = []
        }}>Clear All</ButtonNew
      >
    </div>
  </div>
</FilterCard>

<style lang="scss">
  .input {
    display: flex;
    margin-top: var(--spacing-xl);
    gap: var(--spacing-xl);

    .textinput {
      width: 100%;
    }

    .button {
      width: 5rem;
    }
  }
</style>
