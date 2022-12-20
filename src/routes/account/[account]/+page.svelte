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

  let { state, send } = useMachine(accountStateMachine)

  $: {
    $page.params.account
    ;({ state, send } = useMachine(accountStateMachine))
    send('LOAD', { address: $page.params.account })
  }

  $: if ($state.matches('error')) {
    AlertToast({
      title: 'Account error',
      text: $state.context.error.message,
      type: 'error'
    })()
  }
</script>

<Box px="none" transparent>
  <ResourceViewTitle title="Account" resourceAddress={$page.params.account} />
</Box>
<Box px="none" m="none" transparent>
  {#if $state.matches('error')}
    No account found
  {:else}
    <Card>
      <Text bold slot="header">Tokens (fungible resources)</Text>
      <InfoBox
        slot="body"
        entries={$state.context.transformedOverview?.fungible || []}
        loading={!$state.matches('final')}
      >
        <Text bold underlined slot="key" let:entry>
          <a href="/resource/{entry.address}">{entry.key}</a>
        </Text>
        <Text slot="value" let:entry>{entry.value}</Text>
      </InfoBox>
    </Card>
    <Card>
      <Text bold slot="header">NFTs (nonfungible resources)</Text>
      <InfoBox
        slot="body"
        entries={$state.context.transformedOverview?.nonFungible || []}
        loading={!$state.matches('final')}
      >
        <Text underlined slot="key" let:entry>
          <a href="/nft/{entry.address}">{entry.key}</a>
        </Text>
        <Text slot="value" />
      </InfoBox>
    </Card>
  {/if}
</Box>
