<script lang="ts">
  import { EMPTY_VALUE } from '@components/info-box/InfoBox.svelte'

  export let data: string | undefined
</script>

{data ?? EMPTY_VALUE}
