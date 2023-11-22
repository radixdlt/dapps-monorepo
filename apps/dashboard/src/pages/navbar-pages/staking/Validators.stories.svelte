<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Validators from './Validators.svelte'
  import BigNumber from 'bignumber.js'

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
      type: 'validator' as const,
      address: validatorAddresses[i % 10],
      totalStake: new BigNumber(100000000),
      apy: Math.random() * 10,
      fee: {
        percentage: Math.random() * 5
      },
      uptimePercentages: {
        '1day': Math.random() * 100,
        '1week': Math.random() * 100,
        '1month': Math.random() * 100,
        '3months': Math.random() * 100,
        '6months': Math.random() * 100,
        '1year': Math.random() * 100,
        alltime: Math.random() * 100
      },
      acceptsStake: Math.random() > 0.5 ? true : false,
      percentageTotalStake: Math.random() * 50,
      ownerAddress: 'account_1234567890',
      ownerStake: new BigNumber(23000),
      bookmarked: false,
      selected: false,
      stakeUnitResourceAddress: 'resource_1234567890',
      unstakeClaimResourceAddress: 'resource_1234567890',
      stakeUnitsToStakedRatio: new BigNumber(1),
      totalStakeUnits: new BigNumber(0),
      totalStakeInXRD: new BigNumber(0),
      metadata: {
        standard: {
          name: {
            item: {} as any,
            value: 'RADNODE🔥'
          },
          url: {
            item: {} as any,
            value: 'https://radnode.io'
          }
        },
        nonStandard: [],
        all: [],
        explicit: []
      },
      auth: {} as any
    }))
</script>

<Meta title="Navbar Pages / Validators" />

<Story name="Connected">
  <Validators
    validators={Promise.resolve(validators)}
    filteredValidators={[]}
  />
</Story>
