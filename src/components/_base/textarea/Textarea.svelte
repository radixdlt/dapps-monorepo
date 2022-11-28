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
      cols: 30,
      rows: 4
    },
    md: {
      cols: 60,
      rows: 8
    },
    lg: {
      cols: 80,
      rows: 30
    }
  }[size]
</script>

<textarea bind:value class={style} {placeholder} {...colsAndRows} />
