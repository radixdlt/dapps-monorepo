<script lang="ts">
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'
  import type { LayoutData } from '../$types'
  import { context } from '../+layout.svelte'

  export let data: LayoutData

  const metadata = data.promises.accountData.then(
    ({ details: { metadata } }) => metadata.items
  )

  const activeTab = context.get('activeTab')
  $activeTab = 'metadata'
</script>

<div class="card">
  <MetadataInfoBox {metadata} />
</div>
