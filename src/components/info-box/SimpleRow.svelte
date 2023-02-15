<script lang="ts">
  import Text from '@components/_base/text/Text.svelte'
  import Row from './Row.svelte'

  export let key: string
</script>

<Row>
  <Text slot="left" bold align="right">{key}</Text>
  <slot slot="right" />
</Row>
