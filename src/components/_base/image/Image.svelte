<script lang="ts">
  import type { config } from '@styles'

  export let src: string
  export let alt: string
  export let height: `$${keyof typeof config['theme']['sizes']}` | undefined =
    undefined
  export let width: `$${keyof typeof config['theme']['sizes']}` | undefined =
    undefined
</script>

<img {alt} {src} {height} {width} />
