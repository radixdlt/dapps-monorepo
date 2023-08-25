<script lang="ts">
  import MetadataTable from '@components/metadata-table/MetadataTable.svelte'
  import type { LayoutData } from '../$types'
  import InfoBox from '@components/info-box/InfoBox.svelte'

  export let data: LayoutData

  const metadata = data.promises.entityDetails.then(
    ({ metadata }) => metadata.items
  )
</script>

<div class="card">
  <InfoBox>
    <MetadataTable {metadata} />
  </InfoBox>
</div>
