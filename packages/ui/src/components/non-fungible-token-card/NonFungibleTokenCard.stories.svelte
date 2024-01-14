<script context="module">
  export const meta = {}
</script>

<script>
  import { Story } from '@storybook/addon-svelte-csf'
  import NonFungibleTokenCard from './NonFungibleTokenCard.svelte'
</script>

<Story name="Primary">
  <NonFungibleTokenCard
    imgUrl="https://picsum.photos/1000/500?shuffle"
    name="Test nft"
    address={{
      resourceAddress:
        'resource_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe',
      id: '1',
      nonFungibleAddress:
        'resource_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe:1'
    }}
  />
</Story>
