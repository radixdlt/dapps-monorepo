<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '../text/Text.svelte'

  export let title: string
  export let text: string
  export let type: 'success' | 'error' | 'warning' | 'info' = 'info'

  const borderColors = {
    success: '$primary',
    error: 'red',
    warning: 'orange',
    info: '$onBackground'
  }
</script>

<Box
  cx={{
    borderLeft: 'solid !important',
    borderWidth: '$md !important',
    borderColor: `${borderColors[type]} !important`,
    minHeight: '40px !important'
  }}
>
  <Text bold>{title}</Text>
  {text}
</Box>
