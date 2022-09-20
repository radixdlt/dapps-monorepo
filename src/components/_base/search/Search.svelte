<script lang="ts">
  import { css, type SpaceKeys } from '@styles'

  export let placeholder: string = ''
  export let value: string | undefined = undefined
  export let width: string = ''
  export let borderRadius: SpaceKeys = '$md'

  const icon: string | undefined = '/images/search_icon.svg'

  $: style = css({
    color: '$onSurface',
    border: 'none',
    borderRadius,
    padding: '$sm',
    icon: icon
      ? {
          background: `url(${icon}) no-repeat`,
          backgroundSize: '20px',
          backgroundPosition: 'right 10px center'
        }
      : undefined,
    backgroundColor: '$surface'
  })()
</script>

<input
  style:width
  bind:value
  class={style}
  {placeholder}
  type="text"
/>
