<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import StakingCard from './StakingCard.svelte'
</script>

<Meta title="Navbar Pages / Validators / StakingCard" />

<Story name="Primary">
  <StakingCard staking={20000} unstaking={5000} readyToClaim={200} />
</Story>
