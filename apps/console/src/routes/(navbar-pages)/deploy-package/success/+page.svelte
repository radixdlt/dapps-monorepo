<script lang="ts">
  import Success from '../../../../pages/navbar-pages/deploy-package/Success.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Success {...data} />
