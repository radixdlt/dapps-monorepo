<script lang="ts">
  import Summary from '@dashboard-pages/search-pages/package/Summary.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Summary
  _package={data.promises.package}
  metadata={data.promises.package.then(({ metadata }) => metadata)}
  associatedDapps={data.promises.associatedDapps}
  nonMetadataItems={Promise.resolve([])}
/>
