<script lang="ts">
  import Success from '../../../../pages/_navbar-pages/send-tokens/Success.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Success txID={data.txID} txStatus={data.txStatus} />
