<script lang="ts">
  import type { CSS } from '@stitches/core'

  import { css, type config } from '@styles'

  export let src: string
  export let alt: string
  export let height: `$${keyof typeof config['theme']['sizes']}` | undefined =
    undefined
  export let width: `$${keyof typeof config['theme']['sizes']}` | undefined =
    undefined
  export let cx: CSS<typeof config> = {}

  const style = css({
    width,
    height,
    ...cx
  })
</script>

<!-- eslint-disable-next-line -->
<img on:click {alt} {src} class={style()} />
