<script lang="ts">
  import type { AccountWithStakes, Validator } from '../Validators.svelte'
  import StakedValidatorCard from '../validator-card/staked-validator-card/StakedValidatorCard.svelte'
  import ValidatorList from '../validator-list/ValidatorList.svelte'

  export let validators: Promise<Validator[]>
  export let accounts: Promise<AccountWithStakes[]>

  let accumulatedStakes = Promise.all([accounts, validators]).then(
    ([accounts, validators]) => {
      let accumulated: { [key: string]: AccountWithStakes['stakes'][number] } =
        {}
      let arr: (Validator & AccountWithStakes['stakes'][number])[] = []

      accounts.forEach((account) => {
        account.stakes.forEach((stake) => {
          if (accumulated[stake.validator]) {
            accumulated[stake.validator]!.staked += stake.staked
            accumulated[stake.validator]!.unstaking += stake.unstaking
            accumulated[stake.validator]!.readyToClaim += stake.readyToClaim
          } else {
            accumulated[stake.validator] = stake
          }
        })
      })

      Object.keys(accumulated).forEach((validator) => {
        arr.push({
          ...validators.find((v) => v.address === validator)!,
          ...accumulated[validator]
        })
      })

      return arr
    }
  )
</script>

{#await accumulatedStakes}
  <ValidatorList loading />
{:then accumulatedStakes}
  <ValidatorList items={accumulatedStakes} let:item={validator}>
    {#await Promise.all([validator, validators])}
      <StakedValidatorCard
        validatorInfo={new Promise(() => {})}
        stakingInfo={new Promise(() => {})}
      />
    {:then [validator, validators]}
      <StakedValidatorCard
        validatorInfo={Promise.resolve(validator)}
        stakingInfo={Promise.resolve(validator)}
      />
    {/await}
  </ValidatorList>
{/await}
