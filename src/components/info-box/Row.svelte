<script lang="ts">
  import Text from '@components/_base/text/Text.svelte'

  export let text: string = ''
  export let underlined: boolean = false
  export let faded: boolean = false
  export let paddingTop: string = '6px'
</script>

<slot name="left">
  <Text align="right" bold muted={faded} {underlined} cx={{ paddingTop }}
    >{text}</Text
  >
</slot>
<slot name="right" />
