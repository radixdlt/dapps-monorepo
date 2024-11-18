<script lang="ts">
  import type { getTransactionDetailsNew } from '@api/_deprecated/gateway'
  import CodeBox from '@components/code-box/CodeBox.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import AddressesList from '@components/_base/address/AddressesList.svelte'
  import { fullDateFormatter } from '@dashboard/lib/formatters/full-date'
  import Accordion from '@components/_base/accordion/Accordion.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import Row from '@components/info-box/Row.svelte'
  import AcceptsStake from '@dashboard/lib/accepts-stake/AcceptsStake.svelte'

  export let txId: string
  export let tx: Promise<
    | ReturnType<
        Awaited<ReturnType<typeof getTransactionDetailsNew>>['_unsafeUnwrap']
      >
    | undefined
  >

  const subintentParentHash = (
    hash: string,
    _subintents: NonNullable<Awaited<Awaited<typeof tx>>>['subintents']
  ) =>
    _subintents.find(({ child_subintent_hashes }) =>
      child_subintent_hashes.includes(hash)
    )?.subintent_hash ?? txId

  const subintentParentIndex = (
    hash: string,
    _subintents: NonNullable<Awaited<Awaited<typeof tx>>>['subintents']
  ) =>
    _subintents.findIndex(({ child_subintent_hashes }) =>
      child_subintent_hashes.includes(hash)
    )

  const subintentIndex = (
    hash: string,
    _subintents: NonNullable<Awaited<Awaited<typeof tx>>>['subintents']
  ) => _subintents.findIndex(({ subintent_hash }) => subintent_hash === hash)
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
    <AwaitedRow
      text="Date"
      promise={tx.then((tx) => (tx?.date ? fullDateFormatter(tx.date) : ''))}
    />
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

    <AwaitedRow text="Intents" promise={tx} modifiers="label-full" let:data>
      {@const subintents = data?.subintents}
      {@const rootChildIntents = data?.child_subintents}

      <div style:width="100%" style:margin="1rem 0">
        <div class="accordion">
          <Accordion header="ROOT INTENT">
            <div class="content" slot="content">
              <Row text="Hash">
                <svelte:fragment slot="right">
                  <Address value={txId} autoShorten />
                </svelte:fragment>
              </Row>

              <Row text="Message">
                <svelte:fragment slot="right">
                  {data?.message ?? 'N/A'}
                </svelte:fragment>
              </Row>

              <Row text="Manifest" modifiers="label-full">
                <svelte:fragment slot="right">
                  <CodeBox
                    --code-box-min-height="300px"
                    text={data?.manifest ?? 'Failed to decode manifest'}
                  />
                </svelte:fragment>
              </Row>

              {#if subintents && rootChildIntents && rootChildIntents.length > 0}
                <Row text="Child Subintents" modifiers="label-full">
                  <div slot="right" class="children">
                    {#each rootChildIntents as hash}
                      {@const index = subintentIndex(hash, subintents)}
                      <div class="relation">
                        <div style:text-wrap="nowrap">
                          {`INDEX ${index}`}
                        </div>
                      </div>
                    {/each}
                  </div>
                </Row>
              {/if}
            </div>
          </Accordion>
        </div>
      </div>

      {#if subintents && subintents.length > 0}
        {#each subintents as { subintent_hash, manifest_instructions, child_subintent_hashes, message }, i}
          {@const parent = subintentParentIndex(subintent_hash, subintents)}
          <div style:width="100%" style:margin="1rem 0">
            <div class="accordion">
              <Accordion header="SUBINTENT INDEX {i}">
                <div class="content" slot="content">
                  <Row text="subintent hash">
                    <svelte:fragment slot="right">
                      <Address value={subintent_hash} autoShorten />
                    </svelte:fragment>
                  </Row>

                  <Row text="Message">
                    <svelte:fragment slot="right">
                      {message ?? 'N/A'}
                    </svelte:fragment>
                  </Row>

                  <Row text="Parent">
                    <div class="relation" slot="right">
                      <div style:text-wrap="nowrap">
                        {parent >= 0
                          ? `SUBINTENT INDEX ${parent}`
                          : 'ROOT INTENT'}
                      </div>
                    </div>
                  </Row>

                  <Row text="Manifest" modifiers="label-full">
                    <svelte:fragment slot="right">
                      <CodeBox
                        text={manifest_instructions}
                        --code-box-min-height="200px"
                      />
                    </svelte:fragment>
                  </Row>

                  {#if child_subintent_hashes.length > 0}
                    <Row text="Child Subintents" modifiers="label-full">
                      <div slot="right" class="children">
                        {#each child_subintent_hashes as hash}
                          {@const index = subintentIndex(hash, subintents)}
                          <div class="relation">
                            <div style:text-wrap="nowrap">
                              {index >= 0 ? `INDEX ${index}` : 'ROOT'}
                            </div>
                          </div>
                        {/each}
                      </div>
                    </Row>
                  {/if}
                </div>
              </Accordion>
            </div>
          </div>
        {/each}
      {/if}
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

<style lang="scss">
  .accordion {
    :global(.subheader-icon) {
      @include mixins.mobile {
        top: unset;
        right: var(--spacing-lg);
      }
    }

    :global(.header-text) {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-bold-2);

      @include mixins.desktop {
        margin-bottom: 0;
      }
    }

    :global(.header-wrapper) {
      background: var(--color-grey-5);
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--border-radius-md);
    }
  }

  .content {
    background: var(--color-grey-5);
    padding: var(--spacing-xl) var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);

    .subintent-title {
      display: block;
      margin-bottom: var(--spacing-lg);
    }

    :global(:not(.label-full) > .label) {
      @include mixins.desktop {
        margin-bottom: 0 !important;
      }
    }
  }

  .child-hashes {
    :global(.addresses-list) {
      align-items: flex-start;
    }
  }

  .relation {
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;

    > div {
      background: var(--color-grey-4);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--border-radius-md);
      font-weight: var(--font-weight-bold-2);
    }
  }

  .children {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
</style>
