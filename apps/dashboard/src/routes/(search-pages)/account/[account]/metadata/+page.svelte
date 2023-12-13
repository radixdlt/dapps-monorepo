<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  const metadata = data.promises.account.then(({ metadata }) => metadata.all)
</script>

<div class="card">
  <Metadata {metadata} />
</div>
