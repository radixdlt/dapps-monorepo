<script lang="ts">
  import type { Package } from '@api/_deprecated/utils/entities/package'
  import SummaryMetadata from '../SummaryMetadata.svelte'
  import type { metadataItem } from '../utils'

  export let metadata: Promise<Package['metadata']>
  export let nonMetadataItems: Promise<Parameters<typeof metadataItem>[]>
  export let associatedDapps: Promise<
    {
      address: string
      name: string
      iconUrl: string
    }[]
  >
</script>

<div class="card">
  <SummaryMetadata
    standardMetadata={metadata.then(({ standard }) => standard)}
    {nonMetadataItems}
    {associatedDapps}
  />
</div>
