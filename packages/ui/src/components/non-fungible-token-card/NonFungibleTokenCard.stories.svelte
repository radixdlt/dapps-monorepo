<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import NonFungibleTokenCard from './NonFungibleTokenCard.svelte'
</script>

<Meta title="Components / Non-Fungible Token Card" />

<Story name="Primary">
  <NonFungibleTokenCard
    imgUrl="https://picsum.photos/1000/500?shuffle"
    name="Test nft"
    id="12345"
  />
</Story>
