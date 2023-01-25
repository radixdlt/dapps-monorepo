<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { useMachine } from '@xstate/svelte'
  import {
    stateMachine,
    type DeployPayload
  } from './deploy-package-state-machine'
  import { accounts } from '@stores'
  import { goto } from '$app/navigation'
  import DeployPackageForm from './DeployPackageForm.svelte'

  const { state, send } = useMachine(stateMachine, { devTools: true })

  $: if ($accounts) send('CONNECT')

  $: if ($state.matches('deploy.success'))
    goto(
      `deploy-package/success?` +
        `txID=${$state.context.intentHash}&` +
        `packageAddress=${$state.context.packageAddress}&` +
        `badgeName=${$state.context.badge.name}&` +
        `badgeAddress=${$state.context.badge.address}&` +
        `badgeId=${$state.context.badge.id}`
    )

  const handleSend = (payload: DeployPayload) => {
    send({ type: 'DEPLOY', payload })
  }
</script>

<Box>
  <Text size="xxlarge" mb="medium" bold>Deploy Package</Text>
  {#if $state.matches('connect.idle')}
    <Text bold>Please connect your Radix Wallet to get started.</Text>
  {:else if $state.matches('connect.success')}
    <DeployPackageForm
      isDeploying={$state.matches('deploy.pending')}
      onDeploy={handleSend}
    />
  {/if}
</Box>
