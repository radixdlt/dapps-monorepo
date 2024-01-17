<script lang="ts">
  import Metadata from '@svelte-ui/components/metadata/Metadata.svelte'
  import type { LayoutData } from '../$types'
  import InfoBox from '@svelte-ui/components/info-box/InfoBox.svelte'

  export let data: LayoutData

  const metadata = data.promises.entityDetails.then(
    ({ metadata }) => metadata.items
  )
</script>

<div class="card">
  <InfoBox>
    <Metadata {metadata} />
  </InfoBox>
</div>
