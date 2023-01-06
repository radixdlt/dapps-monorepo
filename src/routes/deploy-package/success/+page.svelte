<script lang="ts">
  import Success from '@components/deploy-package/Success.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Success {...data} />
