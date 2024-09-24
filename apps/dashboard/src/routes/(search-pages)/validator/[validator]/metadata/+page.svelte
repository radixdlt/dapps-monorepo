<script lang="ts">
  import type { LayoutData } from '../$types'
  import Metadata from '@components/metadata/Metadata.svelte'

  export let data: LayoutData
</script>

<div class="card">
  <Metadata --label-text-transform="none" metadata={data.promises.metadata} />
</div>
