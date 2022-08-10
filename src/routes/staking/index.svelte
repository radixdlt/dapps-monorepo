<script lang="ts">
  import ValidatorBox from '@components/validator-box/ValidatorBox.svelte'
  import type { Validators } from '@types'

  export let validators: Validators
</script>

<ValidatorBox {validators} />
