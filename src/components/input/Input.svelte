<script lang="ts">
  import { input as style } from './styles'

  export let placeholder: string = ''
  export let value: string
</script>

<input bind:value class={style} {placeholder} type="text" />
