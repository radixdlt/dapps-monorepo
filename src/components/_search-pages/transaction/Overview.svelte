<script lang="ts">
  import InfoBox, { type Entries } from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let loading: boolean
  export let entries: Entries<any>
  export let manifest: string | undefined
</script>

<Box wrapper>
  {#if loading}
    <InfoBox {entries} loading />
  {:else}
    <InfoBox {entries}>
      <svelte:component
        this={entry.key}
        let:entry
        data={entry.data}
        slot="key"
      />
      <svelte:component
        this={entry.value}
        let:entry
        data={entry.data}
        slot="value"
      />
    </InfoBox>
    <Box>
      <Text bold mb="medium">Transaction manifest</Text>
      <pre style="white-space: pre-wrap; word-break: break-word;">{manifest
          ? manifest
          : 'No manifest'}</pre>
    </Box>
  {/if}
</Box>
