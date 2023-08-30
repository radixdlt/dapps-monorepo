<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { LayoutData } from '../$types'
  import InfoBox from '@components/info-box/InfoBox.svelte'

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
