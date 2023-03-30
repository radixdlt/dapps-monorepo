<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { getPopulatedResources } from '@api/utils/resources'
  import LinkList from '@components/_base/link-list/LinkList.svelte'
  import type { EntityMetadataItemValue } from '@radixdlt/babylon-gateway-api-sdk'
  import { addressToRoute } from '@utils'

  export let details: ReturnType<typeof getPopulatedResources>
  const claimedEntitiesDefinition = {
    key: 'claimed entities',
    valueComponent: LinkList,
    valuePropsTransform: (value: EntityMetadataItemValue) => ({
      links: (value.as_string_collection || []).map((entity: string) => ({
        label: entity,
        href: addressToRoute(entity)
      }))
    })
  }

  const knownMetadata: Record<string, typeof claimedEntitiesDefinition> = {
    claimed_entities: claimedEntitiesDefinition
  }
</script>

<Box>
  {#await details}
    <SkeletonLoader />
  {:then details}
    {#if details.fungible.length === 0 && details.nonFungible.length === 0 && details.item.metadata.items.length === 0}
      This account doesn't hold any tokens or NFTs
    {:else}
      <Card>
        <Text bold slot="header">Tokens (fungible resources)</Text>
        <Box bgColor="surface" p="none" slot="body">
          <InfoBox>
            {#if details.fungible.length === 0}
              <Row><Text muted slot="left">None</Text></Row>
            {/if}
            {#each details.fungible as fungible}
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

      <Card>
        <Text bold slot="header">NFTs (nonfungible resources)</Text>
        <Box bgColor="surface" slot="body" p="none">
          <InfoBox>
            {#if details.nonFungible.length === 0}
              <Row><Text muted slot="left">None</Text></Row>
            {/if}
            {#each details.nonFungible as nft}
              <Row>
                <Text slot="left" bold underlined>
                  <a href="/nft/{nft.address}">{nft.label}</a>
                </Text>
                <div slot="right" />
              </Row>
            {/each}
          </InfoBox>
        </Box>
      </Card>

      <Card>
        <Text bold slot="header">Metadata</Text>
        <Box bgColor="surface" slot="body" p="none">
          <InfoBox>
            {#if details.item.metadata.items.length === 0}
              <Row><Text muted slot="left">None</Text></Row>
            {/if}
            {#each details.item.metadata.items as metadata}
              {#if knownMetadata[metadata.key]}
                <Row>
                  <Text slot="left" bold align="right">
                    {knownMetadata[metadata.key]?.key}
                  </Text>
                  <svelte:component
                    this={knownMetadata[metadata.key]?.valueComponent}
                    {...knownMetadata[metadata.key]?.valuePropsTransform(
                      metadata.value
                    )}
                    slot="right"
                  />
                </Row>
              {:else}
                <Row>
                  <Text slot="left" bold align="right">{metadata.key}</Text>
                  <Textarea
                    slot="right"
                    editable={false}
                    dynamic
                    size="single-line"
                    value={metadata.value.as_string_collection
                      ? metadata.value.as_string_collection.join('\n')
                      : metadata.value.as_string}
                    padding="$0"
                    fontSize="$md"
                  />
                </Row>
              {/if}
            {/each}
          </InfoBox>
        </Box>
      </Card>
    {/if}
  {/await}
</Box>
