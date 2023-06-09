<script lang="ts">
  import type { Account } from '@stores'
  import DappMetadata from './dapp-metadata/DappMetadata.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Box from '@components/_base/box/Box.svelte'

  export let accounts: Account[]
</script>

<Text size="small">
  A dApp Definition is a Radix account that acts as a unique registration for
  everything associated with your dApp. This account has special metadata that
  declares it as a dApp Definition and allows apps like the Radix Wallet to
  verify its association to domains, components, and resources. After you create
  an account in the Radix Wallet, here you can set it as a dApp Definition and
  configure it.
</Text>
<Box my="medium" bgColor="surface">
  <DappMetadata {accounts} />
</Box>
