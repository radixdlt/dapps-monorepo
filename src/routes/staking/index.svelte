<script lang="ts">
  import ValidatorBox from '@components/validator-list/ValidatorList.svelte'
  import type { Validators } from '@types'

  export let validators: Validators
</script>

<ValidatorBox {validators} />
