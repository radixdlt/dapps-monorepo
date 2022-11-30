<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { query } from '@queries'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'

  const { state } = query('getTransactionStatus', $page.params.transaction)

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })
  }
</script>

<InfoBox data={$state.data} loading={$state.status === 'loading'} />
