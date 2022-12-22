<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { getNFTAddress } from '@utils'

  export let txID: string
  export let packageAddress: string
  export let badgeInfo: {
    name?: string
    address: string
    id: string
  }

  const NFTAddress = getNFTAddress(badgeInfo.address, badgeInfo.id)
</script>

<center>
  <Text bold size="xlarge">Your package was submitted! 🎉</Text>
  <Box transparent>
    <InfoBox
      entries={[
        {
          key: 'Tx ID',
          value: txID,
          href: `/transaction/${txID}`
        },
        {
          key: 'Package address',
          value: packageAddress
        },
        {
          key: 'Owner badge',
          value: badgeInfo.name
            ? `${badgeInfo.name} (${NFTAddress})`
            : NFTAddress,
          href: `resource/${badgeInfo.address}`
        }
      ]}
      loading={false}
      transparent
    >
      <Text align="right" bold slot="key" let:entry>
        {entry.key}
      </Text>
      <Text align="left" slot="value" let:entry>
        {#if entry.href}
          <Text color="link">
            <a href={entry.href}>{entry.value}</a>
          </Text>
        {:else}
          {entry.value}
        {/if}
      </Text>
    </InfoBox>
  </Box>
</center>
