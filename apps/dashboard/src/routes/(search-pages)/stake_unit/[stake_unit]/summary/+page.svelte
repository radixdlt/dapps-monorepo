<script lang="ts">
  import Summary from '@dashboard-pages/search-pages/stake-units/Summary.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<Summary
  stakeUnit={data.promises.stakeUnit}
  associatedDapps={data.promises.associatedDapps}
  behaviors={data.promises.stakeUnit.then(({ behaviors }) => behaviors)}
/>
