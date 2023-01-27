<script lang="ts">
  import { EMPTY_VALUE } from '@components/info-box/InfoBox.svelte'

  export let value: string | undefined
</script>

{value ?? EMPTY_VALUE}
