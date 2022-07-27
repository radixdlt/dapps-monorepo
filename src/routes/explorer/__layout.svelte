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

  const redirect = () => goto(`/explorer/transaction/${id}`)
</script>

<div class={frame()}>
  <Input bind:id placeholder="Enter Transaction ID" />
</div>

<Button style={{
    marginTop: 10
}} on:click={redirect}>Search</Button>

<slot></slot>