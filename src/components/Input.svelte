<script lang="ts">
  import { css } from "@styles"

  export let placeholder: string = ''

  const input = css({
    backgroundColor: '$dark',
    border: 'none',
    borderRadius: 10,
    padding: 10
  })
</script>

<input class={input()} placeholder={placeholder} type="text" />
