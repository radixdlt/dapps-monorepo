<script lang="ts">
  import { css } from '@styles'

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined

  const style = css({
    width: '100%',
    borderRadius: '$sm',
    backgroundColor: '$background',
    padding: '$sm',
    border: 'none',
    borderBottom: '1px solid $borderColor',
    color: '$textColor'
  })()
</script>

<input bind:value class={style} {placeholder} />
