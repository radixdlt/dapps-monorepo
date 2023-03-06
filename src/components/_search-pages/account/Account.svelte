<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'
  import type { getResources } from '@components/_navbar-pages/send-tokens/side-effects'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { EntityDetailsResponse } from '@radixdlt/babylon-gateway-api-sdk'

  export let address: string
  export let resources: ReturnType<typeof getResources>
  export let details: Promise<Pick<EntityDetailsResponse, 'metadata'>>

  const values = Promise.all([resources, details])
</script>

<ResourceViewTitle title="Account" resourceAddress={address} />

<Box>
  {#await values}
    <SkeletonLoader />
  {:then [resources, details]}
    {#if resources.fungible.length === 0 && resources.nonFungible.length === 0}
      This account doesn't hold any tokens or NFTs
    {:else}
      {#if resources.fungible.length}
        <Card>
          <Text bold slot="header">Tokens (fungible resources)</Text>
          <Box bgColor="surface" p="none" slot="body">
            <InfoBox>
              {#each resources.fungible as fungible}
                <Row>
                  <Text slot="left" bold underlined align="right">
                    <a href="/resource/{fungible.address}">{fungible.label}</a>
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
      {#if resources.nonFungible.length}
        <Card>
          <Text bold slot="header">NFTs (nonfungible resources)</Text>
          <Box bgColor="surface" slot="body" p="none">
            <InfoBox>
              {#each resources.nonFungible as nft}
                <Row>
                  <Text slot="left" bold underlined>
                    <a href="/nft/{nft.address}">{nft.label}</a>
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
            {#each details.metadata.items as metadata}
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
          </InfoBox>
        </Box>
      </Card>
    {/if}
  {/await}
</Box>
