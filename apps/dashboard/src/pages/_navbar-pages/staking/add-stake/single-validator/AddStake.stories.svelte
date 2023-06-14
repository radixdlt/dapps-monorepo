<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import AddSingleStake from './AddStakeSingle.svelte'
</script>

<Meta title="Navbar Pages / Validators / Add Stake" />

<Story name="Primary">
  <AddSingleStake
    open={true}
    validatorInfo={{
      validatorName: '🔥 RADNODE',
      validatorAddress:
        'validator_tdx_22_128eksrhxcm5chjwkaz5y4mrveqzxg5l96fj6u7hg9pj978c8habcee',
      currentlyStakingAmount: '1234567890'
    }}
    tokenInfo={{
      iconUrl:
        'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
      tokenName: 'XRD',
      tokenBalance: '10000',
      tokenAmount: '10000'
    }}
    xrdBalance="10000"
  />
</Story>
