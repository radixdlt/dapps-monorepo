<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import AddSingleStake from './AddStakeSingle.svelte'
</script>

<Meta title="Navbar Pages / Validators / Add Stake Single Validator" />

<Story name="Primary">
  <AddSingleStake
    open={true}
    validator={{
      name: '🔥 RADNODE',
      address:
        'validator_tdx_22_128eksrhxcm5chjwkaz5y4mrveqzxg5l96fj6u7hg9pj978c8habcee',
      currentlyStakingAmount: '1234567890'
    }}
  />
</Story>
