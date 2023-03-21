<script lang="ts">
  import { getEntityDetails } from '@api/gateway'
  import type { EntityDetailsResponse } from '@radixdlt/babylon-gateway-api-sdk'
  import type { FormattedAccount } from '../side-effects'
  import Text from '@components/_base/text/Text.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import Entity from './Entity.svelte'
  import { sendTransaction } from '@api/wallet'

  export let account: FormattedAccount

  const linkedDapp = (entity: EntityDetailsResponse) => {
    return entity.metadata.items.find(
      (metadata) => metadata.key === 'dapp_definition'
    )?.value
  }

  let entities: Promise<EntityDetailsResponse[]> = new Promise(() => {})

  $: if (account.claimedEntities)
    entities = Promise.all(account.claimedEntities.map(getEntityDetails))

  const setMetadata = (manifest: string) => {
    sendTransaction(manifest)
  }
</script>

<div class="claimed-entities">
  {#await entities}
    <LoadingSpinner />
  {:then entities}
    <Text cx={{ paddingBottom: '$md' }} bold>Claimed Entities</Text>
    {#each entities as entity}
      <Entity
        address={entity.address}
        isLinked={linkedDapp(entity) === account.address}
        onLink={(manifest) => setMetadata(manifest(account.address))}
        onUnlink={(manifest) => setMetadata(manifest(account.address))}
      />
    {/each}
  {/await}
</div>

<style>
  .claimed-entities {
    height: 100%;
    background-color: var(--colors-surface);
    padding: var(--space-md);
  }
</style>
