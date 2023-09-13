<script lang="ts">
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'

  export let data: LayoutData

  goto(`${data.address}/summary`)
</script>
