<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { stateMachine } from './account-state-machine'
  import { useMachine } from '@xstate/svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'

  const { state, send } = useMachine(stateMachine)

  $: send('LOAD', { address: $page.params.account })

  const skeletonData = {
    address: '0x0000000000000000000000000000000000000000',
    balance: '0',
    code: '0x',
    nonce: '0',
    transactionCount: '0'
  }

  $: if ($state.matches('error')) {
    AlertToast({
      title: 'Account error',
      text: $state.context.error.message,
      type: 'error'
    })()
  }
</script>

<Box px="none" m="none" transparent>
  <ResourceViewTitle title="Account" resourceAddress={$page.params.account} />
  {#if $state.matches('error')}
    No account found
  {:else}
    <Text bold mb="medium">Balance</Text>
    <Card>
      <Text bold slot="header">Tokens</Text>
      <InfoBox
        slot="body"
        data={$state.context.transformedOverview?.fungible || skeletonData}
        loading={!$state.matches('final')}
      />
    </Card>
    <Card>
      <Text bold slot="header">NFT</Text>
      <InfoBox
        slot="body"
        data={$state.context.transformedOverview?.nonFungible || skeletonData}
        loading={!$state.matches('final')}
      />
    </Card>
  {/if}
</Box>
