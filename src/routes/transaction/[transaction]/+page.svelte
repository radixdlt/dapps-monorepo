<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { query } from '@queries'
  import Box from '@components/_base/box/Box.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import { getTxManifest } from '../../../to-be-removed/ret'
  import Text from '@components/_base/text/Text.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import Card from '@components/_base/card/Card.svelte'

  export let data: PageData

  $: transactionAddress = data.transactionAddress

  let manifest: string | undefined

  $: ({ state } = query('getTransactionDetails', transactionAddress))

  $: if ($state.status === 'success') {
    getTxManifest($state.data.details).then((res) => {
      manifest = res
    })
  }

  $: if ($state.status === 'error') {
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

<Box>
  <ResourceViewTitle title="Transaction" resourceAddress={transactionAddress} />
</Box>

<Box>
  <Card>
    <Box wrapper slot="body">
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
  </Card>
</Box>
