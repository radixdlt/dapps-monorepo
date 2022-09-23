<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import Button from '@components/_base/button/Button.svelte'
  import WalletSdk from "@radixdlt/wallet-sdk";

  const connect = async () => {
    const sdk = WalletSdk()
    
    const result = await sdk.request({
      accountAddresses: 'any'
    })

    if (result.isOk()) {
      accounts.set(result.value.accountAddresses!)
      selectedAccount.set(result.value.accountAddresses![0])
    } else {
      // TODO
    }
  }
</script>

<Button size="small" on:click={connect}>Connect</Button>
