<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { getTransactionDetails } from '@api/gateway'
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
    <AwaitedRow key="Status" value={tx.then(({ status }) => status)} let:data>
      {#if data === 'committed_success'}
        <Text color="success">{data}</Text>
      {/if}

      {#if data === 'committed_failure' || data === 'rejected'}
        <Text color="error">{data}</Text>
      {/if}
    </AwaitedRow>

    <AwaitedRow
      key="State Version"
      value={tx.then(({ stateVersion }) => stateVersion)}
    />
    <AwaitedRow
      key="Epoch"
      value={tx.then(({ ledgerState: { epoch } }) => epoch)}
    />
    <AwaitedRow
      key="Round"
      value={tx.then(({ ledgerState: { round } }) => round)}
    />
    <AwaitedRow key="Date" value={tx.then(({ date }) => date)} />
    <AwaitedRow key="Fee" value={tx.then(({ fee }) => fee)} />

    <AwaitedRow
      key="Message"
      value={tx.then(({ message }) => message)}
      let:data
    >
      <Box wrapper>
        <Text>{data ?? ''}</Text>
      </Box>
    </AwaitedRow>

    <AwaitedRow
      key="Created Entities"
      value={tx.then(({ createdEntities }) => createdEntities)}
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
      key="Referenced Entities"
      value={tx.then(({ referencedEntities }) => referencedEntities)}
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
      <pre style="white-space: pre-wrap; word-break: break-word;">{manifest
          ? manifest
          : 'Failed to decode manifest'}</pre>
    {/await}
  </Box>
</Box>
