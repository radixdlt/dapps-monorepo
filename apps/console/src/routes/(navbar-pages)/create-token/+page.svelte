<script lang="ts">
  import CreateToken from '../../../pages/navbar-pages/create-token/CreateToken.svelte'
  import NavbarPage from '../../../pages/navbar-pages/NavbarPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<NavbarPage title="Create Token">
  <CreateToken action={data.action} />
</NavbarPage>
