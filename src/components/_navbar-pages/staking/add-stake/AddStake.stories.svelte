<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import AddStake from './AddStake.svelte'
</script>

<Meta title="Navbar Pages / Validators / Add Stake" />

<Story name="Primary">
  <AddStake
    open={true}
    validatorProps={{
      validatorName: '🔥 RADNODE',
      validatorAddress:
        'validator_tdx_22_128eksrhxcm5chjwkaz5y4mrveqzxg5l96fj6u7hg9pj978c8habcee',
      currentlyStakingAmount: 1234567890,
      xrdBalance: 10000
    }}
  />
</Story>
