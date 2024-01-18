<script lang="ts">
  import NavbarPage from '../../../pages/navbar-pages/NavbarPage.svelte'
  import ConfigureMetadata from '../../../pages/navbar-pages/configure-metadata/ConfigureMetadata.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<NavbarPage title="Configure Standard Metadata">
  <ConfigureMetadata query={data.query} />
</NavbarPage>
