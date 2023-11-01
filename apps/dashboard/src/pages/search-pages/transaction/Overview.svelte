<script lang="ts">
  import type { getTransactionDetailsNew } from '@api/gateway'
  import CodeBox from '@components/code-box/CodeBox.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import AddressesList from '@components/_base/address/AddressesList.svelte'

  export let tx: Promise<
    ReturnType<
      Awaited<ReturnType<typeof getTransactionDetailsNew>>['_unsafeUnwrap']
    >
  >
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
      promise={tx.then(({ createdEntities }) =>
        createdEntities.map(({ entity_address }) => entity_address)
      )}
      let:data
    >
      {#if data.length === 0}
        N/A
      {:else}
        <AddressesList addresses={data} autoShorten />
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
        <AddressesList addresses={data} autoShorten />
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
