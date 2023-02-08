<script lang="ts">
  import { EMPTY_VALUE } from '@components/info-box/InfoBox.svelte'

  export let value: Date | undefined
</script>

{value ?? EMPTY_VALUE}
