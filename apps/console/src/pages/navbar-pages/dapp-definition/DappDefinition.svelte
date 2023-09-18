<script lang="ts">
  import type { Account } from '@stores'
  import DappMetadata from './dapp-metadata/DappMetadata.svelte'
  import Text from '@components/_base/text/Text.svelte'

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
<div class="content">
  <DappMetadata {accounts} />
</div>

<style>
  .content {
    background: var(--theme-surface-2);
    padding: var(--spacing-xl);
    margin-top: var(--space-xl);
  }
</style>
