<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Validators from './Validators.svelte'

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

  const validators = Array(50)
    .fill(undefined)
    .map((_, i) => ({
      name: 'RADNODE🔥',
      address: validatorAddresses[i % 10],
      totalStake: '100000000',
      percentageOwnerStake: Math.random() * 30,
      apy: Math.random() * 10,
      fee: Math.random() * 5,
      uptime: Math.random() * 0.9,
      acceptsStake: Math.random() > 0.5 ? true : false,
      percentageTotalStake: Math.random() * 50,
      website: 'https://radnode.io',
      ownerAddress: 'account_1234567890',
      ownerStake: '23000',
      bookmarked: false,
      selected: false,
      stakeUnitResourceAddress: 'resource_1234567890',
      unstakeClaimResourceAddress: 'resource_1234567890'
    }))
</script>

<Meta title="Navbar Pages / Validators" />

<Story name="Connected">
  <Validators validators={Promise.resolve(validators)} />
</Story>
