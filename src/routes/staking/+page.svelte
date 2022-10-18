<script context="module">
  export const prerender = true
</script>

<script lang="ts">
  import ValidatorList from '@components/validator-list/ValidatorList.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import Search from '@components/_base/search/Search.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import { queryServer } from '@queries'
  import type { ValidatorTransformedArray } from '@io/gateway'
  import LoadingSpinner from '@components/_base/loading-spinner/LoadingSpinner.svelte'

  let validators: ValidatorTransformedArray

  queryServer('getValidators').then((res) => (validators = res))

  let filtered = ''
</script>

<Box transparent p="large">
  <Box m="large" transparent>
    <Search bind:value={filtered} />
  </Box>
  {#if validators}
    <Card>
      <IconTextItem bold isIconColor icon="transactions" slot="header"
        >Staking</IconTextItem
      >
      
      <ValidatorList {filtered} slot="body" data={validators} />
    </Card>
  {:else}
    <LoadingSpinner />
  {/if}
</Box>
