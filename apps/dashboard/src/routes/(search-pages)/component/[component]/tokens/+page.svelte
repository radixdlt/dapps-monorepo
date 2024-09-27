<script lang="ts">
  import type { LayoutData } from '../$types'
  import FungibleTokensPageWrapper from '@dashboard/lib/token-pages/FungibleTokensPageWrapper.svelte'

  export let data: LayoutData
</script>

<FungibleTokensPageWrapper
  data={{
    promises: {
      entity: data.promises.component,
      fungibleResources: data.promises.fungibleResources
    }
  }}
/>
