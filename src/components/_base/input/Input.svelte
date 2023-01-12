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

  const typeAction = (node: HTMLInputElement) => {
    node.type = type
  }

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

<input use:typeAction bind:value class={style} {placeholder} />
