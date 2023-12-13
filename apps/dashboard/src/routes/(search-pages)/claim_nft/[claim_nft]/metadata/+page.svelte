<script lang="ts">
  import Metadata from '@dashboard-pages/search-pages/stake-units/Metadata.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<Metadata
  metadata={data.promises.claimNft.then((claimNft) => claimNft.metadata.all)}
/>
