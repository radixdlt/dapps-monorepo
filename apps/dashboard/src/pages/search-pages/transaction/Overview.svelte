<script lang="ts">
  import type { getTransactionDetailsNew } from '@api/_deprecated/gateway'
  import CodeBox from '@components/code-box/CodeBox.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import AddressesList from '@components/_base/address/AddressesList.svelte'
    import { fullDateFormatter } from '@dashboard/lib/formatters/full-date'

  export let tx: Promise<
    | ReturnType<
        Awaited<ReturnType<typeof getTransactionDetailsNew>>['_unsafeUnwrap']
      >
    | undefined
  >
  export let manifest: Promise<string | undefined>
</script>

<div class="surface-2">
  <InfoBox>
    <AwaitedRow text="Status" promise={tx} let:data>
      {#if data}
        {#if data.status === 'CommittedSuccess'}
          <span class="text-success">Committed Success</span>
        {:else if data.status === 'CommittedFailure' || data.status === 'Rejected'}
          <span style:text-align="right">
            <div class="text-error">
              {data.status}
            </div>
            <div class="subtext">
              {data.receipt?.error_message}
            </div>
          </span>
        {:else}
          {data}
        {/if}
      {/if}
    </AwaitedRow>

    <AwaitedRow
      text="State Version"
      promise={tx.then((tx) => tx?.stateVersion || '')}
    />
    <AwaitedRow text="Epoch" promise={tx.then((tx) => tx?.epoch || '')} />
    <AwaitedRow text="Round" promise={tx.then((tx) => tx?.round || '')} />
    <AwaitedRow text="Date" promise={tx.then((tx) => tx?.date ? fullDateFormatter(tx.date) : '')} />
    <AwaitedRow text="Fee" promise={tx.then((tx) => tx?.fee || '')} />

    <AwaitedRow
      text="Message"
      promise={tx.then((tx) => tx?.message || '')}
      let:data
    >
      {data ?? 'N/A'}
    </AwaitedRow>

    <AwaitedRow
      text="Created Entities"
      promise={tx.then((tx) =>
        tx?.createdEntities
          ? tx.createdEntities.map(({ entity_address }) => entity_address)
          : []
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
      promise={tx.then((tx) => tx?.affectedEntities || [])}
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
      promise={tx.then((tx) => tx?.events || '')}
      modifiers="label-full"
      let:data
    >
      <CodeBox --code-box-min-height="300px" text={data} />
    </AwaitedRow>
  </InfoBox>
</div>
