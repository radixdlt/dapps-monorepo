<script lang="ts">
  import type { CSS } from '@stitches/core/types/css-util'
  import { btn } from './styles'

  export let style: CSS | undefined = undefined
</script>

<button {...$$restProps} on:click class={btn(style)}>
  <slot />
</button>
