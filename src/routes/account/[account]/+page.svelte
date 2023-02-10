<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import type { PageData } from './$types'
  import { writable } from 'svelte/store'
  import { getResources } from '@components/send-tokens/side-effects'
  import { goto } from '$app/navigation'
  import { query } from '@api/query'

  export let data: PageData

  $: accountAddress = data.accountAddress

  const transformedOverview = writable<
    Awaited<ReturnType<typeof getResources>> | undefined
  >(undefined)

  let loading = false
  $: {
    accountAddress
    loading = true
  }

  $: getResources(accountAddress)
    .then((resources) => {
      transformedOverview.set(resources)
      loading = false
    })
    .catch((e) => {
      loading = false
      goto('/not-found')
    })

  $: ({ send, response } = query('getEntityDetails'))

  $: send(accountAddress)
</script>

<Box>
  <ResourceViewTitle title="Account" resourceAddress={accountAddress} />
</Box>
<Box>
  {#if $transformedOverview?.fungible.length === 0 && $transformedOverview.nonFungible.length === 0}
    This account doesn’t hold any tokens or NFTs
  {:else}
    {#if $transformedOverview?.fungible.length}
      <Card>
        <Text bold slot="header">Tokens (fungible resources)</Text>
        <Box bgColor="surface" p="none" slot="body">
          <InfoBox entries={$transformedOverview.fungible || []} {loading}>
            <Text bold underlined slot="key" let:entry>
              <a href="/resource/{entry.address}">{entry.key}</a>
            </Text>
            <Text slot="value" let:entry>{entry.value}</Text>
          </InfoBox>
        </Box>
      </Card>
    {/if}
    {#if $transformedOverview?.nonFungible.length}
      <Card>
        <Text bold slot="header">NFTs (nonfungible resources)</Text>
        <Box bgColor="surface" slot="body" p="none">
          <InfoBox entries={$transformedOverview?.nonFungible || []} {loading}>
            <Text underlined slot="key" let:entry>
              <a href="/nft/{entry.address}">{entry.key}</a>
            </Text>
            <Text slot="value" />
          </InfoBox>
        </Box>
      </Card>
    {/if}
    <Card>
      <Text bold slot="header">Metadata</Text>
      <Box bgColor="surface" slot="body" p="none">
        <InfoBox entries={$response?.metadata.items} />
      </Box>
    </Card>
  {/if}
</Box>
