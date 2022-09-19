<script lang="ts">
  import type { SpaceKeys } from '@styles'
  import { input as style } from './styles'

  export let placeholder: string = ''
  export let value: string
  export let width: string = ''
  export let borderRadius: SpaceKeys = '$md'
  export let icon: string | undefined = undefined
</script>

<input
  style:width
  bind:value
  class={style(borderRadius, icon)}
  {placeholder}
  type="text"
/>
