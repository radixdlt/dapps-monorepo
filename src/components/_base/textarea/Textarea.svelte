<script lang="ts">
  import { css } from '@styles'

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let size: 'sm' | 'md' | 'lg' = 'md'

  const style = css({
    resize: 'none',
    borderRadius: '$sm',
    outline: 'none',
    border: 'none',
    padding: '$md'
  })()

  const colsAndRows = {
    sm: {
      cols: 15,
      rows: 2
    },
    md: {
      cols: 30,
      rows: 4
    },
    lg: {
      cols: 60,
      rows: 8
    }
  }[size]
</script>

<textarea bind:value class={style} {placeholder} {...colsAndRows} />
