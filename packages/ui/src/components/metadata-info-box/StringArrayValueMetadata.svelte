<script lang="ts">
  export let values: (string | boolean)[]
</script>

{(values || []).map((value) => String(value)).join(', ')}
