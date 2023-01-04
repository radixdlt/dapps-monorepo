<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { accountStateMachine } from '@stateMachines'
  import { useMachine } from '@xstate/svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: accountAddress = data.accountAddress

  let { state, send } = useMachine(accountStateMachine)

  $: {
    accountAddress
    ;({ state, send } = useMachine(accountStateMachine))
    send('LOAD', { address: accountAddress })
  }

  $: if ($state.matches('error')) {
    AlertToast({
      title: 'Account error',
      text: $state.context.error.message,
      type: 'error'
    })()
  }
</script>

<Box>
  <ResourceViewTitle title="Account" resourceAddress={accountAddress} />
</Box>
<Box>
  {#if $state.matches('error')}
    No account found
  {:else}
    <Card>
      <Text bold slot="header">Tokens (fungible resources)</Text>
      <Box bgColor="surface" p="none" slot="body">
        {#if $state.matches('final') && $state.context.transformedOverview?.fungible.length === 0}
          <Box bgColor="surface">
            <Text>No tokens found</Text>
          </Box>
        {:else}
          <InfoBox
            entries={$state.context.transformedOverview?.fungible || []}
            loading={!$state.matches('final')}
          >
            <Text bold underlined slot="key" let:entry>
              <a href="/resource/{entry.address}">{entry.key}</a>
            </Text>
            <Text slot="value" let:entry>{entry.value}</Text>
          </InfoBox>
        {/if}
      </Box>
    </Card>

    <Card>
      <Text bold slot="header">NFTs (nonfungible resources)</Text>
      <Box bgColor="surface" slot="body" p="none">
        {#if $state.matches('final') && $state.context.transformedOverview?.nonFungible.length === 0}
          <Box>
            <Text>No NFTs found</Text>
          </Box>
        {:else}
          <InfoBox
            entries={$state.context.transformedOverview?.nonFungible || []}
            loading={!$state.matches('final')}
          >
            <Text underlined slot="key" let:entry>
              <a href="/nft/{entry.address}">{entry.key}</a>
            </Text>
            <Text slot="value" />
          </InfoBox>
        {/if}
      </Box>
    </Card>
  {/if}
</Box>
