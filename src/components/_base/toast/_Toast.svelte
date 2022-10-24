<script lang="ts">
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import Box from '@components/_base/box/Box.svelte'
</script>

<Box
  cx={{
    display: 'contents',
    '._toastItem': {
      color: '$onBackground !important',
      background: '$surface !important',
      alignItems: 'flex-start !important',
      minHeight: '0 !important'
    },
    '._toastBar': {
      height: '0 !important'
    },
    '._toastMsg': {
      padding: '$0 !important'
    },
    '._toastBtn': {
      mt: '$md !important',
      mx: '$sm !important'
    }
  }}
>
  <SvelteToast />
</Box>
