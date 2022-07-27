<script lang="ts">
  import { goto } from "$app/navigation"
  import Button from "@components/Button.svelte"

  import Input from "@components/Input.svelte"

  import { css } from "@styles"

  let id: string

  const frame = css({
    display: "flex",
    flexDirection: "column"
  })

  const redirect = () => goto(`/transaction/${id}`)
</script>

<div class={frame()}>
  <Input bind:id placeholder="Enter Transaction ID" />
</div>

<Button on:click={redirect}>Search</Button>