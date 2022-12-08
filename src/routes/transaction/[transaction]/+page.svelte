<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { query } from '@queries'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'

  const { state } = query('getTransactionDetails', $page.params.transaction)

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })()
  }
</script>

<Box transparent m="none" p="none" full>
  <Text size="xxlarge" bold>Transaction</Text>
</Box>

<Box full>
  {#if $state.status === 'loading'}
    <InfoBox
      data={{
        Status: undefined,
        Date: undefined,
        Fee: undefined
      }}
      loading
    />
  {:else}
    <InfoBox
      data={{
        Status: $state.data?.status,
        Date: $state.data?.date,
        Fee: $state.data?.fee
      }}
      loading={false}
    />
  {/if}
</Box>
