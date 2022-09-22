<script lang="ts">
  import { css, config } from '@styles'

  export let placeholder: string = ''
  export let value: string | undefined = undefined

  const style = css({
    color: '$onSurface',
    border: 'none',
    borderRadius: '$searchBorder',
    py: '$md',
    px: '$lg',
    background: "url('/images/search_icon.svg') no-repeat", // TODO: use icon component / make it work nicely for dark mode
    backgroundSize: config.theme.sizes.xs,
    backgroundPosition: `right ${config.theme.space.lg} center`,
    backgroundColor: '$surface',
    shadow: true,
    width: '$1'
  })()
</script>

<div>
  <input bind:value class={style} {placeholder} type="text" />
  <span />
</div>
