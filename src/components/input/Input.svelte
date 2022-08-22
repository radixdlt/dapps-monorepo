<script lang="ts">
  import { css } from '@styles'

  export let placeholder: string = ''
  export let value: string = ''

  const input = css({
    backgroundColor: '$grey',
    border: 'none',
    borderRadius: '$md',
    padding: '$sm'
  })
</script>

<input bind:value class={input()} {placeholder} type="text" />
