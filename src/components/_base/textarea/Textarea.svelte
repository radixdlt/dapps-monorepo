<script lang="ts">
  import { css } from '@styles'

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let transparent = true
  export let disabled = false
  export let maxlength: number | undefined = undefined

  $: style = css({
    borderRadius: '$sm',
    outline: 'none',
    border: 'none',
    padding: '$sm',
    backgroundColor: `${transparent ? '' : '$background'}`,
    opacity: `${disabled ? '50%' : '100%'}`
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

<textarea
  {disabled}
  style="resize:none"
  bind:value
  class={style}
  {placeholder}
  {maxlength}
  {...colsAndRows}
/>
