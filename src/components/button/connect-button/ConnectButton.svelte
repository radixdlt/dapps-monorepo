<script lang="ts">
  import { Wallet } from 'radix-js'
  import { accounts, selectedAccount } from '@stores'
  import Button from '../Button.svelte'

  const connect = async () => {
    if (!Wallet.isAvailable()) {
      // TODO
    }

    const result = await Wallet.connect('Radix Dashboard', { accounts: 'any' })

    if (result.isOk()) {
      accounts.set(result.value.accounts)
      selectedAccount.set(result.value.accounts[0])
    } else {
      // TODO
    }
  }
</script>

<Button size="small" on:click={connect}>Connect</Button>
