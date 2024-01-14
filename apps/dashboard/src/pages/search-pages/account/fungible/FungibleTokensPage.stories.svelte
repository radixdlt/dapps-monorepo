<script context="module">
  export const meta = {}
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
  import FungibleTokensPage from './FungibleTokensPage.svelte'
</script>

<Story name="Primary">
  <FungibleTokensPage
    data={Promise.resolve({
      xrd: {
        address:
          'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
        amount: '1000',
        symbol: 'XRD',
        iconUrl: '',
        linksTo: '',
        numberOfTags: 0
      },
      tokens: [
        {
          address:
            'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
          amount: '9932.8172',
          symbol: 'FLOOP',
          iconUrl: '',
          linksTo: '',
          numberOfTags: 8
        },
        {
          address:
            'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
          amount: '100000.81',
          symbol: 'rUSD',
          iconUrl: '',
          linksTo: '',
          numberOfTags: 5
        },
        {
          address:
            'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
          amount: '100000.81',
          symbol: 'OCI',
          iconUrl: '',
          linksTo: '',
          numberOfTags: 4
        }
      ]
    })}
  />
</Story>
