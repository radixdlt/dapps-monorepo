<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { getTransactionDetails } from '@api/gateway'
  import CodeBox from '@components/code-box/CodeBox.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { addressToRoute } from '@utils'
  import AwaitedRow from '../../info-box/AwaitedRow.svelte'

  export let tx: ReturnType<typeof getTransactionDetails>
  export let manifest: Promise<string | undefined>
</script>

<Box wrapper>
  <InfoBox>
    <AwaitedRow
      text="Status"
      promise={tx.then(({ status }) => status)}
      let:data
    >
      {#if data === 'CommittedSuccess'}
        <Text color="success">{data}</Text>
      {/if}

      {#if data === 'CommittedFailure' || data === 'Rejected'}
        <Text color="error">{data}</Text>
      {/if}
    </AwaitedRow>

    <AwaitedRow
      text="State Version"
      promise={tx.then(({ stateVersion }) => stateVersion)}
    />
    <AwaitedRow
      text="Epoch"
      promise={tx.then(({ ledgerState: { epoch } }) => epoch)}
    />
    <AwaitedRow
      text="Round"
      promise={tx.then(({ ledgerState: { round } }) => round)}
    />
    <AwaitedRow text="Date" promise={tx.then(({ date }) => date)} />
    <AwaitedRow text="Fee" promise={tx.then(({ fee }) => fee)} />

    <AwaitedRow
      text="Message"
      promise={tx.then(({ message }) => message)}
      let:data
    >
      <Box wrapper>
        <Text>{data ?? ''}</Text>
      </Box>
    </AwaitedRow>

    <AwaitedRow
      text="Created Entities"
      promise={tx.then(({ createdEntities }) => createdEntities)}
      let:data
    >
      <Box wrapper>
        {#each data as entity}
          <Text color="link">
            <a href={addressToRoute(entity.global_address)}>
              {entity.global_address}
            </a>
          </Text>
        {/each}
      </Box>
    </AwaitedRow>

    <AwaitedRow
      text="Referenced Entities"
      promise={tx.then(({ referencedEntities }) => referencedEntities)}
      let:data
    >
      <Box wrapper>
        {#each data as entity}
          <Text color="link">
            <a href={addressToRoute(entity)}>
              {entity}
            </a>
          </Text>
        {/each}
      </Box>
    </AwaitedRow>
  </InfoBox>

  <Box>
    <Text bold mb="medium">Transaction manifest</Text>
    {#await manifest}
      <SkeletonLoader />
    {:then manifest}
      <div style:height="300px">
        <CodeBox text={manifest ?? 'Failed to decode manifest'} />
      </div>
    {/await}
  </Box>
</Box>
