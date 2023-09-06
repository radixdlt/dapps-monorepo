<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { LayoutData } from '../$types'
  import { activeTab } from '../+layout.svelte'

  export let data: LayoutData

  const metadata = data.promises.accountData.then(
    ({ details: { metadata } }) => metadata.items
  )

  $activeTab = 'metadata'
</script>

<div class="card">
  <Metadata {metadata} />
</div>
