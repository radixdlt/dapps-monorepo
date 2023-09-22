<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import { metadataItem } from './utils'
  import type { Entity } from '@api/utils/entities'
  import RedeemableTokens from './RedeemableTokens.svelte'
  import AssociatedDapps from './AssociatedDapps.svelte'
  import Tags from '@components/_base/tags/Tags.svelte'
  import Row from '@components/info-box/Row.svelte'
  import type { ComponentProps } from 'svelte'

  export let standardMetadata: Promise<Entity['metadata']['standard']>
  export let nonMetadataItems: Promise<Parameters<typeof metadataItem>[]>
  export let associatedDapps: Promise<
    {
      address: string
      name: string
      iconUrl: string
    }[]
  > = Promise.resolve([])
  export let redeemableTokens: Promise<
    | {
        iconUrl?: string
        name?: string
      }[]
    | undefined
  > = Promise.resolve(undefined)
  export let omittedKeys: string[] = []
  export let expectedEntries: ComponentProps<Metadata>['expectedEntries'] = {}

  const omitted = ['name', 'symbol', 'icon_url', 'description', 'tags']

  $: combined = Promise.all([standardMetadata, nonMetadataItems]).then(
    ([metadata, nonMetadata]) => [
      ...nonMetadata.map((args) => metadataItem(...args)),
      ...Object.entries(metadata)
        .map(([_, value]) => value?.item)
        .filter((item) => !omitted.concat(omittedKeys).includes(item?.key))
        .filter((item) => item !== undefined)
        .flat()
    ]
  )
</script>

<Metadata {expectedEntries} metadata={combined}>
  <svelte:fragment slot="extra-rows">
    {#await standardMetadata then metadata}
      <Row text="Tags">
        <Tags showNetworkTag={false} slot="right" tags={metadata.tags?.value} />
      </Row>
    {/await}

    {#await associatedDapps then dapps}
      {#if dapps.length > 0}
        <AssociatedDapps
          cardInfo={dapps.map(({ name, iconUrl, address }) => ({
            address,
            text: name,
            iconUrl
          }))}
        />
      {/if}
    {/await}
    {#await redeemableTokens then tokens}
      {#if tokens}
        {#if tokens.length > 0}
          <RedeemableTokens {tokens} />
        {/if}
      {/if}
    {/await}
  </svelte:fragment>
</Metadata>
