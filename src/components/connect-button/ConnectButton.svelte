<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import Button from '@components/_base/button/Button.svelte'
  import { onMount } from 'svelte'

  let connect: () => void

  onMount(async () => {
    const { requestAddresses } = await import('@wallet')

    connect = async () => {
      const result = await requestAddresses()
      if (result.isOk()) {
        accounts.set(result.value.accountAddresses!)
        selectedAccount.set(result.value.accountAddresses![0])
      } else {
        // TODO
      }
    }
  })
</script>

<Button size="small" on:click={connect}>Connect</Button>
