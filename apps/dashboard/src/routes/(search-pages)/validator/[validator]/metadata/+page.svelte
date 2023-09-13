<script lang="ts">
  import type { LayoutData } from '../$types'
  import Metadata from '@dashboard-pages/search-pages/validator/Metadata.svelte'

  export let data: LayoutData
</script>

<Metadata metadata={data.promises.metadata} />
