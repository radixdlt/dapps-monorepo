<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { query } from '@queries'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'

  const { state } = query('getEntityResources', $page.params.account)

  let accountData = {}

  $: if ($state.status === 'success') {
    accountData = {
      XRD: $state.data.non_fungible_resources.total_count
    }
  }

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Account error',
      text: $state.error.message,
      type: 'error'
    })()
  }
</script>

<Box full transparent>
  <Box p="none" transparent inline items="baseline">
    <Text size="xlarge" mb="large" bold>Account</Text>
    <Text size="small" mx="medium" muted>{$page.params.account}</Text>
  </Box>
  <Text bold mb="medium">Balance</Text>
  <Card>
    <Text bold slot="header">Tokens</Text>
    <InfoBox
      slot="body"
      data={accountData}
      loading={$state.status === 'loading'}
    />
  </Card>
</Box>
