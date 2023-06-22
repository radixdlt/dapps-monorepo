<script lang="ts">
  import ValidatorDetails from '@pages/navbar-pages/staking/validator-details/ValidatorDetails.svelte'
  import type { LayoutData } from '../$types'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  $: validator = data.promises.validators.then((validators) =>
    validators.find((validator) => validator.address === $page.params.validator)
  )

  let open = true

  $: if (!open) {
    goto('/validators')
  }
</script>

<ValidatorDetails {validator} bind:open />
