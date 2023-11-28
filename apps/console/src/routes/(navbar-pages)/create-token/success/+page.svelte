<script lang="ts">
  import Success from '../../../../pages/navbar-pages/create-token/Success.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Success {...data} />
