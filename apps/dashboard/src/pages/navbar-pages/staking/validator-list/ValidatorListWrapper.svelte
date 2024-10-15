<script lang="ts">
  import { goto } from '$app/navigation'

  import ValidatorList, {
    type ValidatorListInput
  } from './ValidatorList.svelte'

  export let validators: ValidatorListInput
  export let amountOfPlaceholders: number
  export let showStakeInfo: boolean = false
</script>

<ValidatorList {validators} on:click-validator>
  <svelte:fragment
    slot="rows"
    let:ValidatorRow
    let:selectedUptime
    let:validators
  >
    {#await validators}
      {#each Array(amountOfPlaceholders) as _}
        <ValidatorRow input={'loading'} />
      {/each}
    {:then validators}
      {#each validators as validator}
        <ValidatorRow
          input={{
            validator,
            selectedUptime
          }}
          {showStakeInfo}
          on:click={() => goto(`/network-staking/${validator.address}`)}
          on:claim-validator
        />
      {/each}
    {/await}
  </svelte:fragment>
</ValidatorList>
