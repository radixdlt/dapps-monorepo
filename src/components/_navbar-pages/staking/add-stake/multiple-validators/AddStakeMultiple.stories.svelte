<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import AddStakeMultiple from './AddStakeMultiple.svelte'

  const validatorAddresses = [
    'validator_1234567890',
    'validator_1234567891',
    'validator_1234567892',
    'validator_1234567893',
    'validator_1234567894',
    'validator_1234567895',
    'validator_1234567896',
    'validator_1234567897',
    'validator_1234567898',
    'validator_1234567899'
  ]

  const validators = Array(5)
    .fill(undefined)
    .map((_, i) => ({
      name: 'RADNODE🔥',
      address: validatorAddresses[i % 10],
      totalStake: Math.random() * 1000000,
      percentageOwnerStake: Math.random() * 30,
      apy: Math.random() * 10,
      fee: Math.random() * 5,
      uptime: Math.random() * 0.9,
      acceptsStake: Math.random() > 0.5 ? true : false,
      percentageTotalStake: Math.random() * 50,
      website: 'https://radnode.io',
      ownerAddress: 'account_1234567890',
      ownerStake: Math.random() * 1000000,
      accumulatedStaked: 0,
      accumulatedUnstaking: 0,
      accumulatedReadyToClaim: 0,
      bookmarked: false,
      selected: false
    }))
</script>

<Meta title="Navbar Pages / Validators / Add Multiple Stake" />

<Story name="Primary">
  <AddStakeMultiple
    open={true}
    {validators}
    tokenInfo={{
      iconUrl:
        'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
      tokenName: 'XRD'
    }}
    tokenBalance="10000"
  />
</Story>
