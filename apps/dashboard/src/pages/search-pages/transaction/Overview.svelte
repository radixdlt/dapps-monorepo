<script lang="ts">
  import type { getTransactionDetails } from '@api/gateway'
  import CodeBox from '@components/code-box/CodeBox.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import { addressToRoute } from '@utils'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import { goto } from '$app/navigation'

  export let tx: ReturnType<typeof getTransactionDetails>
  export let manifest: Promise<string | undefined>
</script>

<div class="surface-2">
  <InfoBox>
    <AwaitedRow
      text="Status"
      promise={tx.then(({ status }) => status)}
      let:data
    >
      {#if data === 'CommittedSuccess'}
        <span class="text-success">Committed Success</span>
      {:else if data === 'CommittedFailure' || data === 'Rejected'}
        <span class="text-error">{data}</span>
      {:else}
        {data}
      {/if}
    </AwaitedRow>

    <AwaitedRow
      text="State Version"
      promise={tx.then(({ stateVersion }) => stateVersion)}
    />
    <AwaitedRow text="Epoch" promise={tx.then(({ epoch }) => epoch)} />
    <AwaitedRow text="Round" promise={tx.then(({ round }) => round)} />
    <AwaitedRow text="Date" promise={tx.then(({ date }) => date)} />
    <AwaitedRow text="Fee" promise={tx.then(({ fee }) => fee)} />

    <AwaitedRow
      text="Message"
      promise={tx.then(({ message }) => message)}
      let:data
    >
      {data ?? 'N/A'}
    </AwaitedRow>

    <AwaitedRow
      text="Created Entities"
      promise={tx.then(({ createdEntities }) => createdEntities)}
      let:data
    >
      {#if data.length === 0}
        N/A
      {:else}
        <div class="addresses-list">
          {#each data as { entity_address }}
            <Address
              autoShorten
              useBackground
              on:click={() => goto(addressToRoute(entity_address))}
              value={entity_address}
            />
          {/each}
        </div>
      {/if}
    </AwaitedRow>

    <AwaitedRow
      text="Affected Entities"
      promise={tx.then(({ affectedEntities }) => affectedEntities)}
      let:data
    >
      {#if data.length === 0}
        N/A
      {:else}
        <div class="addresses-list">
          {#each data as entity_address}
            <Address
              autoShorten
              useBackground
              on:click={() => goto(addressToRoute(entity_address))}
              value={entity_address}
            />
          {/each}
        </div>
      {/if}
    </AwaitedRow>

    <AwaitedRow
      text="Transaction manifest"
      promise={manifest}
      modifiers="label-full"
      let:data
    >
      <CodeBox
        --code-box-min-height="300px"
        text={data ?? 'Failed to decode manifest'}
      />
    </AwaitedRow>

    <AwaitedRow
      text="Events"
      promise={tx.then(({ events }) => events)}
      modifiers="label-full"
      let:data
    >
      <CodeBox --code-box-min-height="300px" text={data} />
    </AwaitedRow>
  </InfoBox>
</div>

<style lang="scss">
  .addresses-list {
    display: flex;
    flex-direction: column;
  }
</style>
