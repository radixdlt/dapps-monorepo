<script lang="ts">
  import CardRow from '@components/info-box/CardRow.svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import { metadataItem } from './resource/Resource.svelte'
  import type { Resource } from '@api/utils/resources'

  export let metadata: Promise<Resource['metadata']>
  export let nonMetadataItems: Promise<Parameters<typeof metadataItem>[]>
  export let associatedDapps: Promise<
    {
      name: string
      iconUrl: string
    }[]
  >

  $: combined = Promise.all([metadata, nonMetadataItems]).then(
    ([metadata, nonMetadata]) => [
      ...nonMetadata.map((args) => metadataItem(...args)),
      ...metadata.explicit,
      ...metadata.nonStandard
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
