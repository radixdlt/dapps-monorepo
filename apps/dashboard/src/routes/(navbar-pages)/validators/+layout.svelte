<script lang="ts">
  import Validators from '@pages/navbar-pages/staking/Validators.svelte'
  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<Validators validators={data.promises.validators} />

<slot />
