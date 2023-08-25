<script lang="ts">
  import MetadataTable from '@components/metadata-table/MetadataTable.svelte'
  import type { LayoutData } from '../$types'
  import { context } from '../+layout.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'

  export let data: LayoutData

  const metadata = data.promises.accountData.then(
    ({ details: { metadata } }) => metadata.items
  )

  const activeTab = context.get('activeTab')
  $activeTab = 'metadata'
</script>

<div class="card">
  <InfoBox>
    <MetadataTable {metadata} />
  </InfoBox>
</div>
