<script lang="ts">
  import Text from '@components/_base/text/Text.svelte'

  const text = $$props.getValue()
</script>

<Text cellAlign="right">
  {text}
</Text>
