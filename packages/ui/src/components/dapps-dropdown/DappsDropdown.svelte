<script lang="ts">
  import { RadixNetwork } from '@common/gateway-sdk'
  import { CURRENT_NETWORK } from '@networks'
  import '@radixdlt/dapps-dropdown'

  const networkName =
    CURRENT_NETWORK.id === RadixNetwork.Mainnet ? 'Mainnet' : 'Stokenet'
</script>

<radix-dapps-dropdown {networkName} />
