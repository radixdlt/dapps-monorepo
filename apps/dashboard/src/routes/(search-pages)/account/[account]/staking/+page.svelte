<script lang="ts">
  import type { PageData } from './$types'
  import StakingPageWrapper from '@dashboard/lib/token-pages/StakingPageWrapper.svelte'

  export let data: PageData
</script>

<StakingPageWrapper stakeInfo={data.promises.stakeInfo} withSummary={true} />
