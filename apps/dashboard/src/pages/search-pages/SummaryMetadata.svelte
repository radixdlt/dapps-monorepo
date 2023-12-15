<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import { metadataItem } from './utils'
  import type { Entity } from '@api/utils/entities'
  import RedeemableTokens from './RedeemableTokens.svelte'
  import AssociatedDapps from './AssociatedDapps.svelte'
  import Tags from '@components/_base/tags/Tags.svelte'
  import Row from '@components/info-box/Row.svelte'
  import type { ComponentProps } from 'svelte'
  import Behaviors from './Behaviors.svelte'
  import type { Resource } from '@api/utils/entities/resource'

  export let useOfficialRadixTag = Promise.resolve(false)
  export let standardMetadata: Promise<Entity['metadata']['expected']>
  export let nonMetadataItems: Promise<Parameters<typeof metadataItem>[]>
  export let associatedDapps: Promise<
    {
      address: string
      name: string
      iconUrl: string
    }[]
  > = Promise.resolve([])
  export let behaviors: Promise<Resource<any, any>['behaviors']> | undefined =
    undefined
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
    {#await Promise.all( [standardMetadata, useOfficialRadixTag] ) then [metadata, isXRD]}
      <Row text="Tags">
        <Tags showNetworkTag={isXRD} slot="right" tags={metadata.tags?.value} />
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

    {#await Promise.all( [behaviors, useOfficialRadixTag] ) then [behaviors, isXRD]}
      {#if behaviors}
        <Behaviors {isXRD} {behaviors} />
      {/if}
    {/await}
  </svelte:fragment>
</Metadata>
