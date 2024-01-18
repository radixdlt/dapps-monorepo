<script lang="ts">
  import type { Package } from '@api/utils/entities/package'
  import type { metadataItem } from '../utils'
  import SummaryTab from '../SummaryTab.svelte'

  export let _package: Promise<Package>
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
  <SummaryTab
    entity={_package}
    standardMetadata={metadata.then(({ expected }) => expected)}
    {nonMetadataItems}
    {associatedDapps}
  />
</div>
