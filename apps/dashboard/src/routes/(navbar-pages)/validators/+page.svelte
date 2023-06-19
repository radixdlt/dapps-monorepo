<script lang="ts">
  import { getValidatorsList } from '@api/gateway'
  import { getEnumStringMetadata } from '@api/utils/resources'
  import Validators, {
    type Validator
  } from '@pages/navbar-pages/staking/Validators.svelte'

  const validators = getValidatorsList().then(({ items }) =>
    items.map((validator) => {
      const state: any = validator.state || {}
      return {
        name: getEnumStringMetadata('name')(validator.metadata),
        website: getEnumStringMetadata('url')(validator.metadata),
        address: validator.address,
        fee: (state.validator_fee_factor || 0) * 100,
        percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,
        totalStake: parseInt(validator.current_stake),

        // TODO:
        ownerAddress: '',
        ownerStake: 0,
        percentageOwnerStake: 0,
        apy: 0,
        uptime: 0,
        acceptsStake: true,
        accumulatedStaked: 0,
        accumulatedUnstaking: 0,
        accumulatedReadyToClaim: 0
      } as Validator
    })
  )
</script>

<Validators {validators} />
