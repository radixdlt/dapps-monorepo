<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { query } from '@queries'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import { getTxManifest } from '../../../to-be-removed/ret'
  import Text from '@components/_base/text/Text.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'

  export let data: PageData

  $: transactionAddress = data.transactionAddress

  let manifest: string | undefined

  let { state } = query('getTransactionDetails', transactionAddress)
  $: {
    $page.params.transaction
    ;({ state } = query('getTransactionDetails', transactionAddress))
  }

  $: if ($state.status === 'success') {
    getTxManifest($state.data.details).then((res) => {
      manifest = res
    })
  }

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })()
    goto('/not-found')
  }

  $: entries = [
    {
      key: 'Status',
      value: $state.data?.status
    },
    {
      key: 'Date',
      value: $state.data?.date
    },
    {
      key: 'Fee',
      value: `${$state.data?.fee} XRD`
    }
  ]
</script>

<Box m="none" px="none" full>
  <ResourceViewTitle
    title="Transaction"
    resourceAddress={$page.params.transaction}
  />
</Box>

<Box bgColor="surface" full>
  {#if $state.status === 'loading'}
    <InfoBox {entries} loading />
  {:else}
    <InfoBox {entries} loading={false} />
    <Box>
      <Text bold mb="medium">Transaction manifest</Text>
      <pre style="white-space: pre-wrap; word-break: break-word;">{manifest
          ? manifest
          : 'No manifest'}</pre>
    </Box>
  {/if}
</Box>
