<script lang="ts">
  import { css } from "@styles"

  export let placeholder: string = ''
  export let id: string

  const input = css({
    backgroundColor: '$grey',
    border: 'none',
    borderRadius: '$md',
    padding: '$sm',
  })
</script>

<input bind:value={id} class={input()} {placeholder} type="text" />
