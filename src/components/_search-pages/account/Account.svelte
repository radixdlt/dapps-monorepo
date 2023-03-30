<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { getPopulatedResources } from '@api/utils/resources'

  export let details: ReturnType<typeof getPopulatedResources>
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
            {#each details.item.metadata.items as metadata}
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
            {/each}
          </InfoBox>
        </Box>
      </Card>
    {/if}
  {/await}
</Box>
