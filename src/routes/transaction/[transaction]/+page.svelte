<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { query } from '@queries'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import { getTxManifest } from '../../../to-be-removed/ret'
  import Text from '@components/_base/text/Text.svelte'

  let manifest: string | undefined

  const { state } = query('getTransactionDetails', $page.params.transaction)

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
  }
</script>

<Box transparent m="none" px="none" full>
  <ResourceViewTitle
    title="Transaction"
    resourceAddress={$page.params.transaction}
  />
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
        Fee: `${$state.data?.fee} XRD`
      }}
      loading={false}
    />
    <Box>
      <Text bold mb="medium">Transaction manifest</Text>
      {manifest ? manifest : 'No manifest'}
    </Box>
  {/if}
</Box>
