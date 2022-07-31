<script lang="ts">
  import { Wallet } from "@sdk"
  import { accounts } from "@stores"

  import Button from "./Button.svelte"

  const connect = async () => {
    if (!Wallet.isAvailable()) {
      // TODO
    }

    const result = await Wallet.connect("Radix Dashboard", { accounts: "any" })

    if (result.isOk()) {
      accounts.set(result.value.accounts)
    } else {
      // TODO
    }
  }
</script>

<Button
  style={{
    backgroundColor: "$primary",
    "&:hover": {
      backgroundColor: "$primaryLight"
    }
  }}
  on:click={connect}
>
  Connect
</Button>
