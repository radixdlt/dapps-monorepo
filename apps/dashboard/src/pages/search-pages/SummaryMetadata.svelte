<script lang="ts">
  import CardRow from '@components/info-box/CardRow.svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import { metadataItem } from './utils'
  import type { Entity } from '@api/utils'

  export let standardMetadata: Promise<Entity['metadata']['standard']>
  export let nonMetadataItems: Promise<Parameters<typeof metadataItem>[]>
  export let associatedDapps: Promise<
    {
      name: string
      iconUrl: string
    }[]
  >

  $: combined = Promise.all([standardMetadata, nonMetadataItems]).then(
    ([metadata, nonMetadata]) => [
      ...nonMetadata.map((args) => metadataItem(...args)),
      ...Object.entries(metadata)
        .map(([_, value]) => value?.item)
        .filter((item) => item !== undefined)
        .flat()
    ]
  )
</script>

<Metadata metadata={combined}>
  <svelte:fragment slot="extra-rows">
    {#await associatedDapps then dapps}
      {#if dapps.length > 0}
        <CardRow
          title="Associated Dapps"
          cardInfo={dapps.map(({ name, iconUrl }) => ({
            text: name,
            iconUrl
          }))}
        />
      {/if}
    {/await}
  </svelte:fragment>
</Metadata>
