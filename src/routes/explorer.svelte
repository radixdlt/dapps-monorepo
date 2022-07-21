<script lang="ts">
  import Input from "@components/Input.svelte"

  import { css } from "@styles"

  const frame = css({
    display: "flex",
    flexDirection: "column"
  })
</script>

<div class={frame()}>
  <Input placeholder="Search by Address, Transaction ID, Validator ID, or Token RRI" />
</div>
