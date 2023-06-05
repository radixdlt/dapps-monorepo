<script lang="ts">
  import { format as _format } from '@directives/format-input'

  export let value: string | number
  export let maxlength: number | undefined = undefined
  export let width: string | undefined = undefined
  export let format: (value: string) => string = (value) => value
  export let dir: 'ltr' | 'rtl' | undefined = undefined
</script>

<input use:_format={format} bind:value {maxlength} {dir} style:width />
