<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import type { PageData } from './$types'
  import { writable } from 'svelte/store'
  import { getResources } from '@components/_navbar-pages/send-tokens/side-effects'
  import { goto } from '$app/navigation'
  import { query } from '@api/query'
  import Row from '@components/info-box/Row.svelte'

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
          <InfoBox>
            {#each $transformedOverview.fungible as fungible}
              <Row>
                <Text slot="left" bold underlined align="right">
                  <a href="/resource/{fungible.address}">{fungible.key}</a>
                </Text>
                <Text slot="right">
                  {fungible.value}
                </Text>
              </Row>
            {/each}
          </InfoBox>
        </Box>
      </Card>
    {/if}
    {#if $transformedOverview?.nonFungible.length}
      <Card>
        <Text bold slot="header">NFTs (nonfungible resources)</Text>
        <Box bgColor="surface" slot="body" p="none">
          <InfoBox>
            {#each $transformedOverview.nonFungible as nft}
              <Row>
                <Text slot="left" bold underlined>
                  <a href="/nft/{nft.address}">{nft.key}</a>
                </Text>
                <div />
              </Row>
            {/each}
          </InfoBox>
        </Box>
      </Card>
    {/if}
    <Card>
      <Text bold slot="header">Metadata</Text>
      <Box bgColor="surface" slot="body" p="none">
        <InfoBox>
          {#if $response}
            {#each $response.metadata.items as metadata}
              <Row>
                <Text slot="left" bold>{metadata.key}</Text>
                <Text slot="right">{metadata.value}</Text>
              </Row>
            {/each}
          {/if}
        </InfoBox>
      </Box>
    </Card>
  {/if}
</Box>
