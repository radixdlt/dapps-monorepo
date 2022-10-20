<script lang="ts">
  import ValidatorList from '@components/validator-list/ValidatorList.svelte'
  import type { PageData } from './$types'
  import Card from '@components/_base/card/Card.svelte'
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import Search from '@components/_base/search/Search.svelte'
  import Box from '@components/_base/box/Box.svelte'

  export let data: PageData

  let filtered = ''
</script>

<Box transparent p="large">
  <Box m="large" transparent>
    <Search bind:value={filtered} />
  </Box>
  <Card>
    <IconTextItem bold isIconColor icon="transactions" slot="header"
      >Staking</IconTextItem
    >
    <ValidatorList {filtered} slot="body" data={data.validators} />
  </Card>
</Box>
