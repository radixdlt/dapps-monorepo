<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { page } from '$app/stores'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { accountStateMachine } from '@stateMachines'
  import { useMachine } from '@xstate/svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'

  const { state, send } = useMachine(accountStateMachine)

  $: send('LOAD', { address: $page.params.account })

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
        keys={$state.context.transformedOverview?.fungible?.map(
          (item) => item.label
        ) || []}
        values={$state.context.transformedOverview?.fungible?.map(
          (item) => item.value
        ) || []}
        loading={!$state.matches('final')}
      />
    </Card>
    <Card>
      <Text bold slot="header">NFT</Text>
      <InfoBox
        slot="body"
        keys={$state.context.transformedOverview?.nonFungible?.map(
          (item) => item.label
        ) || []}
        loading={!$state.matches('final')}
      />
    </Card>
  {/if}
</Box>
