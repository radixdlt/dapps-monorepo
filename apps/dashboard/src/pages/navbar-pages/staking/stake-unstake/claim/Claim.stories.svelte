<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Claim from './Claim.svelte'
</script>

<Meta title="Navbar Pages / Validators / Claim" />

<Story name="Primary">
  <Claim
    open={true}
    availableToClaim={[
      {
        validator: {
          name: '🔥 RADNODE',
          address:
            'validator_tdx_22_128eksrhxcm5chjwkaz5y4mrveqzxg5l96fj6u7hg9pj978c8habcee'
        },
        amount: '90000'
      },
      {
        validator: {
          name: '🔥 RADNODE',
          address:
            'validator_tdx_22_128eksrhxcm5chjwkaz5y4mrveqzxg5l96fj6u7hg9pj978c8habcee'
        },
        amount: '1000'
      }
    ]}
    token={{
      iconUrl:
        'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
      name: 'XRD'
    }}
    account={{
      address: '123123123123123123123',
      label: 'Account 1',
      displayed: 'Account 1',
      appearanceId: 1
    }}
  />
</Story>
