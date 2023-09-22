<script lang="ts">
  import Summary from '@dashboard-pages/search-pages/component/Summary.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Summary
  component={data.promises.pool}
  associatedDapps={data.promises.associatedDapps}
/>
