<script lang="ts">
  import { css } from '@styles'

  type T = $$Generic<'number' | 'text'>

  export let type: T
  export let value:
    | {
        number: number
        text: string
      }[typeof type]
    | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let disabled = false

  const typeAction = (node: HTMLInputElement) => {
    node.type = type
  }

  $: style = css({
    width: '100%',
    borderRadius: '$sm',
    backgroundColor: '$background',
    padding: '$sm',
    border: 'none',
    borderBottom: '1px solid $borderColor',
    color: '$textColor',
    opacity: `${disabled ? '50%' : '100%'}`
  })()
</script>

<input {disabled} use:typeAction bind:value class={style} {placeholder} />
