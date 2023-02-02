<script lang="ts">
  import { EMPTY_VALUE } from '@components/info-box/InfoBox.svelte'

  export let data: Date | undefined
</script>

{data ?? EMPTY_VALUE}
