<script context="module">
  export const meta = {}
</script>

<script>
  import { Story } from '@storybook/addon-svelte-csf'
  import StakingCard from './StakingCard.svelte'
</script>

<Story name="Primary">
  <StakingCard
    staking={Promise.resolve('20000')}
    unstaking={Promise.resolve('5000')}
    readyToClaim={Promise.resolve('200')}
    claimText="Claim"
  />
  <br />
  <StakingCard
    staking={new Promise(() => {})}
    unstaking={new Promise(() => {})}
    readyToClaim={new Promise(() => {})}
    claimText="Claim"
  />
</Story>
