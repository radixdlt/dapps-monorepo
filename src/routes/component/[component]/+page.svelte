<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData

  $: componentAddress = data.componentAddress
</script>
