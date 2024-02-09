<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  const metadata = data.resource.metadata.all
</script>

<div class="card">
  <Metadata {metadata} />
</div>
