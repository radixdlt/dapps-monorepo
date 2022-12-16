<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { shortenAddress } from '@utils'

  export let txID: string
  export let packageAddress: string
  export let badgeInfo: {
    name?: string
    address: string
  }
  export let badgeMetadata: Array<{
    key: string
    value: string
  }>
</script>

<center>
  <Text bold size="xlarge">Your package was submitted! 🎉</Text>
  <Box cx={{ width: '70%' }} transparent>
    <InfoBox
      keys={['Tx ID', 'Package address', 'Owner badge']}
      values={[
        txID,
        packageAddress,
        badgeInfo.name
          ? `(${badgeInfo.name}) ${shortenAddress(badgeInfo.address)}`
          : badgeInfo.address
      ]}
      loading={false}
      transparent
    />

    <InfoBox transparent unknownMetadata={badgeMetadata} loading={false} />
  </Box>
</center>
