<script lang="ts">
  import { EMPTY_VALUE } from '@components/info-box/InfoBox.svelte'

  export let data: number | undefined
</script>

{data ?? EMPTY_VALUE}
