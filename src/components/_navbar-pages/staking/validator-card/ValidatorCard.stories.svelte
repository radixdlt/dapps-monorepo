<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import StakedValidatorCard from './staked-validator-card/StakedValidatorCard.svelte'
  import ValidatorListCard from './validator-list-card/ValidatorListCard.svelte'
</script>

<Meta title="Navbar Pages / Validators / Validator Card" />

<Template let:args>
  <div style:display="flex" style:flex-direction="column" style:gap="2rem">
    <ValidatorListCard validatorInfo={args} />

    <StakedValidatorCard
      validatorInfo={{
        ...args,
        acceptsStake: false
      }}
      stakedAmount={1000}
      unstakingAmount={500}
      readyToClaim={200}
    />

    <ValidatorListCard validatorInfo={new Promise(() => {})} />
  </div>
</Template>

<Story
  name="Primary"
  args={{
    name: '🔥RADNODE',
    address: 'validator_1234567890',
    totalStake: '1000000',
    percentageOwnerStake: '0.5',
    apy: '0.5',
    fee: '0.5',
    uptime: '0.5',
    acceptsStake: true,
    percentageTotalStake: '0.5'
  }}
/>
