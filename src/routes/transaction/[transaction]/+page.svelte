<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { query } from '@queries'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { onMount } from 'svelte'

  const { state } = query('getTransactionDetails', $page.params.transaction)

  let decompileTxIntent: any

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })()
  }

  onMount(() => {
    import('../../../radix-engine-toolkit').then((module) => {
      decompileTxIntent = module.toolkit.then((fn) =>
        fn('decompile_unknown_transaction_intent')
      )
    })
  })

  let manifest: string

  $: if ($state.data) {
    ;(async () =>
      (manifest = (await decompileTxIntent)({
        manifest_instructions_output_format: 'String',
        compiled_unknown_intent: $state.data.details
      }).signed_intent.intent.manifest.instructions.value))()
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
  <Text bold>Transaction Manifest</Text>
  <Box>
    {#if $state.status === 'loading'}
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
    {:else}
      {manifest}
    {/if}
  </Box>
</Box>
