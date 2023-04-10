<script lang="ts">
  import { css, type Size, type SpaceKeys } from '@styles'
  import { onMount } from 'svelte'

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let size: 'single-line' | 'sm' | 'md' | 'lg' = 'md'
  export let dynamic: boolean = false
  export let transparent = true
  export let disabled = false
  export let editable = true
  export let maxlength: number | undefined = undefined
  export let padding: SpaceKeys = '$sm'
  export let fontSize: Size = '$sm'

  $: style = css({
    borderRadius: '$sm',
    outline: 'none',
    border: 'none',
    padding,
    backgroundColor: `${transparent ? '' : '$background'}`,
    opacity: `${disabled ? '50%' : '100%'}`,
    resize: 'none',
    width: '100%',
    fontSize
  })()

  let component: HTMLTextAreaElement

  const adjustHeight = () => {
    if (!dynamic) return
    component.style.height = ''
    component.style.height = component.scrollHeight + 'px'
  }

  onMount(() => adjustHeight())

  const colsAndRows = {
    ['single-line']: {
      cols: 30,
      rows: 1
    },
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
  bind:this={component}
  on:input={adjustHeight}
  readonly={!editable}
  {disabled}
  bind:value
  class={style}
  {placeholder}
  {maxlength}
  {...colsAndRows}
/>
