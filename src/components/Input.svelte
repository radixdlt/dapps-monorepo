<script lang="ts">
  import { css } from "@styles"

  export let placeholder: string = ''
  export let id: string

  const input = css({
    backgroundColor: '$dark',
    border: 'none',
    borderRadius: 10,
    padding: 10
  })
</script>

<input bind:value={id} class={input()} placeholder={placeholder} type="text" />
