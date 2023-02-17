<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import type { PageData } from './$types'
  import { goto } from '$app/navigation'
  import { query } from '@api/query'
  import Row from '@components/info-box/Row.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'

  export let data: PageData

  $: accountAddress = data.accountAddress

  $: ({ send: getEntityDetails, response: entityDetailsResponse } =
    query('getEntityDetails'))

  $: ({
    send: getResources,
    response: resourcesResponse,
    error
  } = query('getResources'))

  $: getEntityDetails(accountAddress)

  $: getResources(accountAddress)

  $: if ($error) goto('/not-found')
</script>

<Box>
  <ResourceViewTitle title="Account" resourceAddress={accountAddress} />
</Box>
<Box>
  {#if $resourcesResponse?.fungible.length === 0 && $resourcesResponse.nonFungible.length === 0}
    This account doesn’t hold any tokens or NFTs
  {:else}
    {#if $resourcesResponse?.fungible.length}
      <Card>
        <Text bold slot="header">Tokens (fungible resources)</Text>
        <Box bgColor="surface" p="none" slot="body">
          <InfoBox>
            {#each $resourcesResponse.fungible as fungible}
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
    {#if $resourcesResponse?.nonFungible.length}
      <Card>
        <Text bold slot="header">NFTs (nonfungible resources)</Text>
        <Box bgColor="surface" slot="body" p="none">
          <InfoBox>
            {#each $resourcesResponse.nonFungible as nft}
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
          {#if $entityDetailsResponse}
            {#each $entityDetailsResponse.metadata.items as metadata}
              <Row>
                <Text slot="left" bold align="right">{metadata.key}</Text>
                <Textarea
                  slot="right"
                  editable={false}
                  dynamic
                  size="single-line"
                  value={metadata.value}
                  padding="$0"
                  fontSize="$md"
                />
              </Row>
            {/each}
          {/if}
        </InfoBox>
      </Box>
    </Card>
  {/if}
</Box>
