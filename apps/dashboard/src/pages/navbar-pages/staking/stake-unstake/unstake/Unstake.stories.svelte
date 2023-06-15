<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import UnstakeSingle from './UnstakeSingle.svelte'
</script>

<Meta title="Navbar Pages / Validators / Unstake Single" />

<Story name="Primary">
  <UnstakeSingle
    open={true}
    unstakeCardProps={{
      validator: {
        name: 'Radnode 🔥',
        address: '123123123123123123123'
      },
      tokenCardProps: {
        token: {
          iconUrl:
            'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
          name: 'XRD'
        },
        account: {
          address: '123123123123123123123',
          label: 'Account 1',
          displayed: 'Account 1',
          appearanceId: 1
        },
        stakedAmount: '1234567890'
      }
    }}
  />
</Story>
