<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import ValidatorCard from './ValidatorCard.svelte'
</script>

<Meta title="Navbar Pages / Validators / Validator Card" />

<Template let:args>
  <ValidatorCard
    name={args.name}
    address={args.address}
    totalStake={args.totalStake}
    percentageOwnerStake={args.percentageOwnerStake}
    apy={args.apy}
    fee={args.fee}
    uptime={args.uptime}
    acceptsStake={args.acceptsStake}
    percentageTotalStake={args.percentageTotalStake}
  />
</Template>

<Story
  name="Primary"
  args={{
    name: 'Validator Name',
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
