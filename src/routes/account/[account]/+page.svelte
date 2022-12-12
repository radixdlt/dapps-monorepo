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
        keys={Object.keys($state.context.transformedOverview?.fungible || {})}
        values={Object.values(
          $state.context.transformedOverview?.fungible || {}
        )}
        loading={!$state.matches('final')}
      />
    </Card>
    <Card>
      <Text bold slot="header">NFT</Text>
      <InfoBox
        slot="body"
        keys={Object.keys(
          $state.context.transformedOverview?.nonFungible || {}
        )}
        loading={!$state.matches('final')}
      />
    </Card>
  {/if}
</Box>
