<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import FungibleTokenCard from './FungibleTokenCard.svelte'

  const tokens = [
    {
      symbol: 'XRD',
      address:
        'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
      amount: '1000000.00',
      icon: 'https://picsum.photos/1000/500?shuffle',
      linksTo: 'https://radixdlt.com',
      isXrd: true
    },
    {
      symbol: 'PEPE',
      address:
        'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
      numberOfTags: 5,
      amount: '239910000.990111353',
      icon: 'https://picsum.photos/1000/500?shuffle',
      linksTo: 'https://radixdlt.com'
    },
    {
      address:
        'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
      numberOfTags: 2,
      amount: '100000.81',
      icon: 'https://picsum.photos/1000/500',
      linksTo: 'https://radixdlt.com'
    },
    {
      address:
        'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
      linksTo: 'https://radixdlt.com',
      amount: '0'
    },
    {
      symbol: 'BTC',
      address:
        'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
      numberOfTags: 2,
      amount: '100',
      icon: 'https://picsum.photos/1000/500',
      linksTo: 'https://radixdlt.com'
    },
    {
      symbol: 'TDOLLLOLOLOL',
      address:
        'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
      numberOfTags: 5,
      amount: '23991000990111353.999',
      icon: 'https://picsum.photos/1000/500?shuffle',
      linksTo: 'https://radixdlt.com'
    },
    {
      address:
        'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
      numberOfTags: 2,
      amount: '100',
      linksTo: 'https://radixdlt.com'
    }
  ]
</script>

<Meta title="FungibleTokenCard" />

<Story name="Primary">
  {#each tokens as token, index}
    <div style:margin-bottom="10px">
      <FungibleTokenCard
        symbol={token.symbol}
        address={token.address}
        numberOfTags={token.numberOfTags}
        amount={token.amount}
        iconUrl={`${token.icon}?${index}`}
        linksTo={token.linksTo}
        isXrd={token.isXrd}
      />
    </div>
  {/each}
</Story>

<Story name="Loading" args={{ tokens }}>
  <FungibleTokenCard loading />
</Story>
